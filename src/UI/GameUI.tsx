import React, { ChangeEvent } from 'react';
import '../css/Game.css';
import IUI from './IUI';
import GameGrid from './GameGridUI';
import GameState from '../models/GameState';
import Game from '../game/Game';
import PlayerType, { PlayerTypeValues } from '../models/PlayerType';

export default class GameUI extends React.Component implements IUI {

    private game: Game = new Game(this);

    constructor(props) {
        super(props);
        this.game.senderType = PlayerType.ZeroOrder;
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
        this.game.update();
        this.focusGame();
        console.log(this.game.gameState);
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

    private renderPlayerTypeChoice() {
        const createRadioButton = (type: PlayerType,
                player: PlayerType, onChange: (event: ChangeEvent<HTMLInputElement>) => void) => {
            return (
                <label
                    key={`${type} ${player}`}
                >
                    <input
                        type="radio"
                        value={type}
                        checked={player === type}
                        onChange={onChange}
                    />
                    {PlayerType[type]}
                </label>
            );
        };

        const onSenderTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
            this.game.senderType = Number(event.target.value);
            this.forceUpdate();
        }

        const onReceiverTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
            this.game.receiverType = Number(event.target.value);
            this.forceUpdate();
        }

        return (
            <div className='player-option'>
                <form className='player-type'>
                    <h2>Sender type</h2>
                    {PlayerTypeValues().map(x => createRadioButton(x, this.game.senderType, onSenderTypeChange))}
                </form>
                <form className='player-type'>
                    <h2>Receiver type</h2>
                    {PlayerTypeValues().map(x => createRadioButton(x, this.game.receiverType, onReceiverTypeChange))}
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
                            this.game.gameState !== GameState.Sender &&
                            this.game.gameState !== GameState.ReceiverDone &&
                            this.game.gameState !== GameState.SenderDone}
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