import React from 'react';
import 'src/css/Game.css';
import GameGrid from 'src/GameGrid';
import Round from 'src/Round';
import GameState from 'src/GameState';
import Action from 'src/Action';
import Location from 'src/Location';

interface IGameState {
    round: Round;
    gameState: GameState;
    position: Location;
    path: Action[];
}

export default class Game extends React.Component<{}, IGameState> {

    public constructor(props) {
        super(props);
        this.state = this.generateRound();
    }

    private finishTurn  = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (this.state.gameState === GameState.Sender) {
            const round = this.state.round;
            round.senderLocation = this.state.position;
            this.focusGame();

            this.setState({
                ...this.state,
                position: new Location(2, 2),
                path: [],
                round,
                gameState: GameState.Receiver
            })
        } else if (this.state.gameState === GameState.Receiver) {
            const round = this.state.round;
            round.receiverLocation = this.state.position;

            this.setState({
                ...this.state,
                round,
                gameState: this.state.round.success() ?
                    GameState.Success :
                    GameState.Failure
            })
        }
    }

    private generateRound(): IGameState {
        return {
            round: new Round(),
            gameState: GameState.ShowGoal,
            position: new Location(2, 2),
            path: []
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
                    <button onClick={this.startRound}>Start round</button>
                    <button onClick={this.finishTurn}>Finish</button>
                </div>
                <div
                    className={`message ${this.state.gameState === GameState.Success ? 'success' : 'failure'}`}
                    hidden={this.state.gameState !== GameState.Failure && this.state.gameState !== GameState.Success}
                />
            </div>
        );
    }
}