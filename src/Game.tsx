import React from 'react';
import 'src/css/Game.css';
import GameGrid from 'src/GameGrid';
import Round from 'src/models/Round';
import GameState from 'src/models/GameState';
import Action from 'src/models/Action';
import Location from 'src/models/Location';
import Receiver from 'src/agents/Receiver';
import PlayerType from 'src/models/PlayerType';

interface IGameState {
    round: Round;
    gameState: GameState;
    receiverType: PlayerType;
    position: Location;
    path: Action[];
}

export default class Game extends React.Component<{}, IGameState> {

    private receiver: Receiver;

    public constructor(props) {
        super(props);
        this.receiver = new Receiver();
        this.state = this.generateRound();
    }

    private generateRound(): IGameState {
        return {
            round: new Round(),
            gameState: GameState.ShowGoal,
            position: new Location(2, 2),
            path: [],
            receiverType: PlayerType.ZeroOrder
        }
    }

    componentDidUpdate() {
        if (this.state.gameState === GameState.SenderDone) {
            const round = this.state.round;
            round.senderLocation = this.state.position;
            this.focusGame();

            this.setState({
                ...this.state,
                position: new Location(2, 2),
                path: [],
                round,
                gameState: GameState.Receiver,
            });
        }
        else if (this.state.gameState === GameState.ReceiverDone) {
            const round = this.state.round;
            round.receiverLocation = this.state.position;

            this.setState({
                ...this.state,
                position: new Location(2, 2),
                path: [],
                round,
                gameState: this.getFinalGameState(),
            });
        }

        if (this.state.gameState === GameState.Receiver && this.state.receiverType !== PlayerType.Human) {
            this.setState({
                ...this.state,
                position: this.receiver.getMove(Location.actionsToPath(this.state.path)),
                gameState: GameState.ReceiverDone,
            });
        }
    }

    private getFinalGameState(): GameState {
        if (this.state.round.success()) {
            return GameState.Success;
        } else {
            return GameState.Failure;
        }
    }

    private endTurn  = (event: React.MouseEvent<HTMLButtonElement>) => {
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

    public render() {
        return (
            <div>
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
                    <button onClick={this.newRound}>New round</button>
                    <button
                        onClick={this.startRound}
                        disabled={this.state.gameState !== GameState.ShowGoal}
                    >
                        Start round
                    </button>
                    <button onClick={this.endTurn}>End turn</button>
                </div>
                <div
                    className={`message ${this.state.gameState === GameState.Success ? 'success' : 'failure'}`}
                    hidden={this.state.gameState !== GameState.Failure && this.state.gameState !== GameState.Success}
                />
            </div>
        );
    }
}