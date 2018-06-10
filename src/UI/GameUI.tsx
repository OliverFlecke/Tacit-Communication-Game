import React from 'react';
import '../css/Game.css';
import IUI from './IUI';
import GameGrid from './GameGridUI';
import GameState from '../models/GameState';
import Game from '../game/Game';

export default class GameUI extends React.Component implements IUI {

    private game: Game = new Game(this);

    componentDidUpdate() {
        this.game.update();
    }

    private startRound = () => {
        this.game.startRound();
        this.focusGame();
    }

    /**
     * End the current turn
     */
    private endTurn = () => {
        this.game.endTurn();
        this.focusGame();
    }

    private newRound = () => {
        this.game.newRound();
        this.focusGame();
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
        switch (event.key) {
            case 'Enter':
                switch (this.game.gameState) {
                    case GameState.Initial:
                        this.startRound();
                        break;
                    case GameState.Receiver:
                    case GameState.Sender:
                        this.endTurn();
                        break;
                    case GameState.Failure:
                    case GameState.Success:
                    case GameState.Finished:
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
                    game={this.game}
                    setGameRef={this.setGameRef}
                />
                <div className='controls-container'>
                    <button
                        onClick={this.newRound}
                        disabled={this.game.gameState !== GameState.Finished}
                    >
                        New round
                    </button>
                    <button
                        onClick={this.startRound}
                        disabled={this.game.gameState !== GameState.Initial}
                    >
                        Start round
                    </button>
                    <button
                        onClick={this.endTurn}
                        disabled={this.game.gameState !== GameState.Receiver &&
                            this.game.gameState !== GameState.Sender}
                    >
                        End turn
                    </button>
                </div>
                <div className='statistics'>
                    <div>Successes: {this.game.statistics.successes}</div>
                    <div>Failures:  {this.game.statistics.failures}</div>
                </div>
                <div
                    className={`message ${this.game.getFinalGameState() === GameState.Success ? 'success' : 'failure'}`}
                    hidden={this.game.gameState !== GameState.Finished}
                />
            </div>
        );
    }
}