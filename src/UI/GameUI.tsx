import React, { ChangeEvent } from 'react';
import '../css/Game.css';
import IUI from './IUI';
import GameGrid from './GameGridUI';
import GameState from '../models/GameState';
import Game from '../game/Game';
import PlayerType from '../models/PlayerType';

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

    private onSenderTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.game.senderType = Number(event.target.value);
        this.forceUpdate();
    }

    private onReceiverTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.game.receiverType = Number(event.target.value);
        this.forceUpdate();
    }

    private renderPlayerTypeChoice() {
        return (
            <div className='player-option'>
                <form className='player-type'>
                    <h2>Sender type</h2>
                    <label>
                        <input
                            type="radio"
                            value={PlayerType.Human}
                            checked={this.game.senderType === PlayerType.Human}
                            onChange={this.onSenderTypeChange}
                        />
                        {PlayerType[PlayerType.Human]}
                    </label>
                    <label>
                        <input
                            type="radio"
                            value={PlayerType.ZeroOrder}
                            checked={this.game.senderType === PlayerType.ZeroOrder}
                            onChange={this.onSenderTypeChange}
                        />
                        {PlayerType[PlayerType.ZeroOrder]}
                    </label>
                    {/* <input type="radio" value={PlayerType.Human} checked={this.game.senderType === PlayerType.Human} />
                    <input type="radio" value={PlayerType.Human} checked={this.game.senderType === PlayerType.Human} /> */}
                </form>
                <form className='player-type'>
                    <h2>Receiver type</h2>
                    <label>
                        <input
                            type="radio"
                            value={PlayerType.Human}
                            checked={this.game.receiverType === PlayerType.Human}
                            onChange={this.onReceiverTypeChange}
                        />
                        {PlayerType[PlayerType.Human]}
                    </label>
                    <label>
                        <input
                            type="radio"
                            value={PlayerType.ZeroOrder}
                            checked={this.game.receiverType === PlayerType.ZeroOrder}
                            onChange={this.onReceiverTypeChange}
                        />
                        {PlayerType[PlayerType.ZeroOrder]}
                    </label>
                    {/* <input type="radio" value={PlayerType.Human} checked={this.game.receiverType === PlayerType.Human} />
                    <input type="radio" value={PlayerType.Human} checked={this.game.receiverType === PlayerType.Human} /> */}
                </form>
            </div>
        );
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

                {this.renderPlayerTypeChoice()}
            </div>
        );
    }
}