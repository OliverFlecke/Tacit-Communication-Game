import React, { CSSProperties } from 'react';
import '../css/GameGrid.css';
import Action from '../models/Action';
import Location from '../models/Location';
import Player from '../models/Player';
import GameState from '../models/GameState';
import Game from '../game/Game';
import PlayerType from '../models/PlayerType';

interface IGameGridProps {
    game: Game;
    setGameRef: (element: HTMLDivElement) => void;
}

export default class GameGrid extends React.Component<IGameGridProps, {}> {

    private onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const player = this.props.game.gameState === GameState.Sender ? Player.Sender : Player.Receiver;
        switch (event.key) {
            case 'ArrowRight':
                this.props.game.updateLocation(Action.Right, player);
                break;
            case 'ArrowLeft':
                this.props.game.updateLocation(Action.Left, player);
                break;
            case 'ArrowDown':
                this.props.game.updateLocation(Action.Down, player);
                break;
            case 'ArrowUp':
                this.props.game.updateLocation(Action.Up, player);
                break;
            default:
                break;
        }
    }

    private GetCoordinates(player?: Player): CSSProperties {
        let position: Location;
        switch (player) {
            case Player.Sender:
                position = this.props.game.senderGoal;
                break;
            case Player.Receiver:
                position = this.props.game.receiverGoal;
                break;
            default:
                position = this.props.game.position;
                break;
        }
        return {
            gridColumnStart: position.x,
            gridRowStart: position.y
        }
    }

    public render() {
        const state = this.props.game.gameState;
        return (
            <div
                className='game-container'
                tabIndex={0}
                onKeyDown={this.onKeyDown}
                ref={this.props.setGameRef}
            >
                <div id='game-overlay'>
                    <span className='cell'/>
                    <span className='cell'/>
                    <span className='cell'/>
                    <span className='cell'/>
                    <span className='cell'/>
                    <span className='cell'/>
                    <span className='cell'/>
                    <span className='cell'/>
                    <span className='cell'/>
                </div>
                <div
                    id='game-grid'
                >
                    <span
                        id='sender'
                        className='square player'
                        style={this.GetCoordinates()}
                        hidden={state !== GameState.Sender &&
                            state !== GameState.SenderDone}
                    />
                    <span
                        id='receiver'
                        className='circle player'
                        style={this.GetCoordinates()}
                        hidden={state !== GameState.Receiver &&
                            state !== GameState.ReceiverDone}
                    />
                    <span
                        className='senderGoal player'
                        style={this.GetCoordinates(Player.Sender)}
                        hidden={state !== GameState.Initial &&
                            state !== GameState.Sender &&
                            state !== GameState.SenderDone
                            || (this.props.game.receiverType === PlayerType.Human
                                && this.props.game.senderType !== PlayerType.Human)
                        }
                    />
                    <span
                        className='receiverGoal player'
                        style={this.GetCoordinates(Player.Receiver)}
                        hidden={state !== GameState.Initial &&
                            state !== GameState.Sender &&
                            state !== GameState.SenderDone
                            || (this.props.game.receiverType === PlayerType.Human
                                && this.props.game.senderType !== PlayerType.Human)
                        }
                    />
                </div>
            </div>
        );
    }
}