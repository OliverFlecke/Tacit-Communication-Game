import React from 'react';
import 'src/css/Game.css';
import GameGrid from 'src/GameGrid';
import Round from 'src/models/Round';
import GameState from 'src/models/GameState';
import Action from 'src/models/Action';
import Location from 'src/models/Location';
import Receiver from 'src/agents/Receiver';
import PlayerType from 'src/models/PlayerType';
import Statistics from 'src/models/Statistics';
import Sender from 'src/agents/Sender';

interface IGameState {
    round: Round;
    gameState: GameState;
    receiverType: PlayerType;
    senderType: PlayerType;
    position: Location;
    path: Action[];
}

export default class Game extends React.Component<{}, IGameState> {

    private statistics: Statistics = new Statistics();
    private receiver: Receiver;
    private sender: Sender;

    public constructor(props) {
        super(props);
        this.receiver = new Receiver();
        this.sender = new Sender();
        this.state = this.generateRound();
    }

    componentDidUpdate() {
        const round = this.state.round;
        switch (this.state.gameState) {
            case GameState.SenderDone:
                round.senderLocation = this.state.position;
                round.senderPath = this.state.path;
                this.focusGame();

                this.setState({
                    ...this.state,
                    position: Location.New(2, 2),
                    round,
                    gameState: GameState.Receiver,
                });
                break;
            case GameState.ReceiverDone:
                round.receiverLocation = this.state.position;

                this.setState({
                    ...this.state,
                    position: Location.New(2, 2),
                    round,
                    gameState: this.getFinalGameState(),
                });
                break;

            case GameState.Success:
                this.receiver.addSuccess(Location.actionsToPath(round.senderPath), round.receiverLocation);
                this.statistics.addSuccess();

            case GameState.Failure:
                this.receiver.addError(Location.actionsToPath(round.senderPath), round.receiverLocation);
                this.statistics.addFailure();

            default:
                break;
        }

        // Let the agent take its move
        if (this.state.gameState === GameState.Sender && this.state.senderType !== PlayerType.Human) {
            this.setState({
                ...this.state,
                position: this.sender.getMove(this.state.round),
                gameState: GameState.SenderDone,
            })
        }
        else if (this.state.gameState === GameState.Receiver && this.state.receiverType !== PlayerType.Human) {
            this.setState({
                ...this.state,
                position: this.receiver.getMove(Location.actionsToPath(this.state.path)),
                gameState: GameState.ReceiverDone,
            });
        }
    }

    /**
     * Generate a new round of the game
     * @returns A game state
     */
    private generateRound(): IGameState {
        return {
            round: new Round(),
            gameState: GameState.ShowGoal,
            position: Location.New(2, 2),
            path: [],
            receiverType: PlayerType.ZeroOrder,
            senderType: PlayerType.Human,
        }
    }

    /**
     * @returns The final game state of the round, either Success or Failure
     */
    private getFinalGameState(): GameState {
        if (this.state.round.success()) {
            return GameState.Success;
        } else {
            return GameState.Failure;
        }
    }

    /**
     * End the current turn
     */
    private endTurn = () => {
        const gameState = this.state.gameState;
        if (gameState === GameState.Receiver) {
            this.setState({
                ...this.state,
                gameState: GameState.ReceiverDone,
            });
        }
        else if (gameState === GameState.Sender) {
            this.setState({
                ...this.state,
                gameState: GameState.SenderDone,
            });
        }
    }

    private newRound = () => {
        this.setState(this.generateRound());
    }

    private startRound = () => {
        this.focusGame();
        this.setState({
            ...this.state,
            gameState: GameState.Sender
        })
    }

    /**
     * Set the position of the current player
     * @param position The new position of the player
     * @param action The action performed to get to this location
     */
    private setPosition = (position: Location, action: Action) => {
        const path = this.state.path.concat(action);
        this.setState({
            ...this.state,
            position,
            path
        })
    }

    /**
     * Reference to the game grid. Allows to focus on the game grid after mouse press
     */
    private gameGrid?: HTMLElement;
    private setGameRef = (element: HTMLElement) => {
        this.gameGrid = element;
    }
    private focusGame() {
        if (this.gameGrid) {
            this.gameGrid.focus();
        }
    }

    private onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const gameState = this.state.gameState;
        switch (event.key) {
            case 'Enter':
                switch (gameState) {
                    case GameState.ShowGoal:
                        this.startRound();
                        break;
                    case GameState.Receiver:
                    case GameState.Sender:
                        this.endTurn();
                        break;
                    case GameState.Failure:
                    case GameState.Success:
                        this.newRound();
                        break;
                    default:
                        break;
                }
            default:
                break;
        }
    }

    public render() {
        return (
            <div
                className='global-container'
                onKeyDown={this.onKeyDown}
            >
                <GameGrid
                    receiverGoal={this.state.round.receiverGoal}
                    senderGoal={this.state.round.senderGoal}
                    gameState={this.state.gameState}
                    position={this.state.position}
                    path={this.state.path}
                    setPosition={this.setPosition}
                    setGameRef={this.setGameRef}
                />
                <div className='controls-container'>
                    <button
                        onClick={this.newRound}
                        disabled={this.state.gameState !== GameState.Failure &&
                            this.state.gameState !== GameState.Success}
                    >
                        New round
                    </button>
                    <button
                        onClick={this.startRound}
                        disabled={this.state.gameState !== GameState.ShowGoal}
                    >
                        Start round
                    </button>
                    <button
                        onClick={this.endTurn}
                        disabled={this.state.gameState !== GameState.Receiver &&
                            this.state.gameState !== GameState.Sender}
                    >
                        End turn
                    </button>
                </div>
                <div className='statistics'>
                    <div>Successes: {this.statistics.successes}</div>
                    <div>Failures:  {this.statistics.failures}</div>
                </div>
                <div
                    className={`message ${this.state.gameState === GameState.Success ? 'success' : 'failure'}`}
                    hidden={this.state.gameState !== GameState.Failure && this.state.gameState !== GameState.Success}
                />
            </div>
        );
    }
}