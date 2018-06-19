import Round from '../models/Round';
import GameState from '../models/GameState';
import Location from '../models/Location';
import PlayerType from '../models/PlayerType';
import Statistics from '../models/Statistics';
import Receiver from '../agents/Receiver';
import Sender from '../agents/Sender';
import Action from '../models/Action';
import Player from '../models/Player';
import IUI from '../UI/IUI';
import Strategy from './Strategy';

export default class Game {

    private gameSize = 3;

    private _round: Round = new Round();
    private _gameState: GameState = GameState.Initial;
    public get gameState() {
        return this._gameState;
    }

    public strategy: Strategy = Strategy.ShortestGoalPath;

    public get senderType() {
        return this.sender.mind;
    }
    public set senderType(value : PlayerType) {
        this.sender.mind = value;
    }

    public get receiverType() {
        return this.receiver.mind;
    }
    public set receiverType(value : PlayerType) {
        this.receiver.mind = value;
    }

    private _position: Location = new Location();
    public get position() {
        return this._position;
    }

    private _path: Action[] = [];
    public get path() {
        return this._path;
    }

    public get senderGoal() {
        return this._round.senderGoal;
    }

    public get receiverGoal() {
        return this._round.receiverGoal;
    }

    private _statistics: Statistics = new Statistics();
    public get statistics() {
        return this._statistics;
    }

    private _receiver: Receiver = new Receiver();
    public get receiver() {
        return this._receiver;
    }

    private _sender: Sender = new Sender();
    public get sender() {
        return this._sender;
    }

    public solvedRounds: Round[] = [];
    public get numberOfSolvedRounds() {
        return this.solvedRounds.length;
    }

    private _ui?: IUI;

    constructor(ui?: IUI) {
        this._ui = ui;
    }

    /**
     * Update the UI of the game
     */
    private updateUI() {
        if (this._ui) {
            this._ui.forceUpdate();
        }
    }

    /**
     * Generate a new round of the game
     * @returns A game state
     */
    public reset(round?: Round) {
        this._gameState = GameState.Initial;
        this._position = new Location();
        this._path = [];
        this._round = round ? round : Round.getUniqueRound(this.solvedRounds);
        this.updateUI();
    }

    public update() {
        switch (this._gameState) {
            case GameState.SenderDone:
                this._round.senderLocation = this._position;
                this._round.senderPath = this._path;

                this._position = new Location();
                this._gameState = GameState.Receiver;
                this.updateUI();
                break;
            case GameState.ReceiverDone:
                this._round.receiverLocation = this._position;
                this._position = new Location();
                this._gameState = this.getFinalGameState();
                this.update();
                break;

            case GameState.Success:
                const path = Location.actionsToPath(this._round.senderPath);
                this._receiver.addSuccess(path, this._round.receiverLocation);
                this._sender.addSuccess(path, this._round.receiverLocation);
                this._statistics.addSuccess();

                // Keep track of the rounds that have been solved
                if (!this.solvedRounds.some(x => Round.equals(x, this._round))) {
                    this.solvedRounds = this.solvedRounds.concat(this._round);
                }
                this._gameState = GameState.Finished;
                this.updateUI();
                break;

            case GameState.Failure:
                console.log('ReceiverGoal: ' + this._round.receiverGoal
                    + 'Receiver Location: ' + this._round.receiverLocation
                    + 'SenderGoal: ' + this._round.senderGoal
                    + 'Sender Location: ' + this._round.senderLocation
                    + '\nSender query: ' + this.sender.query
                    + '\n\nReceiver query: ' + this.receiver.query
                );
                this._receiver.addError(Location.actionsToPath(this._round.senderPath), this._round.receiverLocation);
                this._statistics.addFailure();
                this._gameState = GameState.Finished;
                this.updateUI();
                break;

            default:
                break;
        }

        // Let the agent take its move
        if (this._gameState === GameState.Sender && this.senderType !== PlayerType.Human) {
            const callback = (path) => {
                // console.log('Sending doing his action');
                // console.log(path);
                if (this._ui) {
                    let i = 0;
                    const interval = setInterval(() => {
                        const action = path[i++];
                        this.updateLocation(action, Player.Sender);
                        if (i > path.length) {
                            clearInterval(interval);
                            this._gameState = GameState.SenderDone;
                        }
                    }, this._ui.refreshDelay);
                }
                else {
                    for (const action of path) {
                        this.updateLocation(action, Player.Sender);
                    }
                    this._gameState = GameState.SenderDone;
                    this.endTurn();
                }
            }
            this._sender.getPath(this._round, this.strategy, callback);
        }
        else if (this._gameState === GameState.Receiver && this.receiverType !== PlayerType.Human) {
            const callback = (location) => {
                // console.log(location.toString());
                this._position = location;
                this._gameState = GameState.ReceiverDone;
                if (this._ui) {
                    this._ui.forceUpdate();
                } else {
                    this.endTurn();
                }
            }
            this._receiver.getMove(Location.actionsToPath(this._path), this.strategy, callback);
        }

    }

    public simulateRound() {
        const round = Round.getUniqueRound(this.solvedRounds);
        this.reset(round);
        this.startRound();
    }

    public startRound() {
        this._gameState = GameState.Sender;
        this.update();
    }

    /**
     * End the current turn of the round
     */
    public endTurn() {
        if (this.gameState === GameState.Receiver) {
            this._gameState = GameState.ReceiverDone;
        }
        else if (this.gameState === GameState.Sender) {
            this._gameState = GameState.SenderDone;
        }
        this.update();
    }

    /**
     * @returns The final game state of the round, either Success or Failure
     */
    public getFinalGameState(): GameState {
        if (this._round.success()) {
            return GameState.Success;
        } else {
            return GameState.Failure;
        }
    }

    public isValidAction(action: Action, player: Player): boolean {
        if (player === Player.Sender && this.gameState !== GameState.Sender) return false;
        if (player === Player.Receiver && this.gameSize !== GameState.Receiver) return false;

        const position = this._position;
        switch (action) {
            case Action.Right:  return position.x < this.gameSize;
            case Action.Left:   return position.x > 1;
            case Action.Up:     return position.y > 1;
            case Action.Down:   return position.y < this.gameSize;
            default:            return false;
        }
    }

    /**
     * Set the position of the current player
     * @param action The action performed to get to this location
     * @param player
     */
    public updateLocation(action: Action, player: Player) {
        if (!this.isValidAction(action, player)) {
            return;
        }
        this._path = this._path.concat(action);

        switch (action) {
            case Action.Down:
                this.position.y = this.position.y + 1;
                break;
            case Action.Up:
                this.position.y = this.position.y - 1;
                break;
            case Action.Left:
                this.position.x = this.position.x - 1;
                break;
            case Action.Right:
                this.position.x = this.position.x + 1;
            default:
                break;
        }
        this.updateUI();
    }
}