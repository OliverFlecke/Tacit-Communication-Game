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

export default class Game {

    private gameSize = 3;

    private _round: Round = new Round();
    private _gameState: GameState = GameState.Initial;
    public get gameState() {
        return this._gameState;
    }

    public receiverType: PlayerType = PlayerType.Human;
    public senderType: PlayerType = PlayerType.Human;

    private _position: Location = Location.New();
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
    private _sender: Sender = new Sender();

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
    public newRound() {
        this._gameState = GameState.Initial;
        this._position = Location.New();
        this._path = [];
        this._round = new Round();
        this.updateUI();
    }

    public update() {
        switch (this._gameState) {
            case GameState.SenderDone:
                this._round.senderLocation = this._position;
                this._round.senderPath = this._path;

                this._position = Location.New();
                this._gameState = GameState.Receiver;
                this.updateUI();
                break;
            case GameState.ReceiverDone:
                this._round.receiverLocation = this._position;
                this._position = Location.New(2, 2);
                this._gameState = this.getFinalGameState();
                this.updateUI();
                break;

            case GameState.Success:
                this._receiver.addSuccess(Location.actionsToPath(this._round.senderPath), this._round.receiverLocation);
                this._statistics.addSuccess();
                this._gameState = GameState.Finished;
                this.updateUI();
                break;

            case GameState.Failure:
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
            this._path = this._sender.getPath(this._round);
            for (const action of this._path) {
                this._position = Location.getNextLocation(this._position, action);
            }
            // this.endTurn();
        }
        else if (this._gameState === GameState.Receiver && this.receiverType !== PlayerType.Human) {
            this._position = this._receiver.getMove(Location.actionsToPath(this._path));
            // this.endTurn();
        }
    }

    public startRound() {
        this._gameState = GameState.Sender;
        this.update();
        this.updateUI();
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