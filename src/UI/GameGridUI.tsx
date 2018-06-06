import React, { CSSProperties } from 'react';
import 'src/css/GameGrid.css';
import Action from 'src/models/Action';
import Location from 'src/models/Location';
import Player from 'src/models/Player';
import GameState from 'src/models/GameState';

interface IGameGridProps {
    gameState: GameState;
    senderGoal: Location;
    receiverGoal: Location;
    position: Location;
    path: Action[];
    setPosition: (position: Location, action: Action) => void;
    setGameRef: (element: HTMLDivElement) => void;
}

export default class GameGrid extends React.Component<IGameGridProps, {}> {

    private readonly gameSize = 3;

    constructor(props) {
        super(props);
    }

    private IsValidAction(action: Action, player: Player): boolean {
        const position = this.props.position;
        switch (action) {
            case Action.Right:  return position.x < this.gameSize;
            case Action.Left:   return position.x > 1;
            case Action.Up:     return position.y > 1;
            case Action.Down:   return position.y < this.gameSize;
            default:            return false;
        }
    }

    private onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        switch (event.key) {
            case 'ArrowRight':
                this.UpdateLocation(Action.Right, Player.Sender);
                break;
            case 'ArrowLeft':
                this.UpdateLocation(Action.Left, Player.Sender);
                break;
            case 'ArrowDown':
                this.UpdateLocation(Action.Down, Player.Sender);
                break;
            case 'ArrowUp':
                this.UpdateLocation(Action.Up, Player.Sender);
                break;
            default:
                break;
        }
    }

    private UpdateLocation(action: Action, player: Player) {
        if (!this.IsValidAction(action, player)) {
            return;
        }

        const position: Location = this.props.position;
        switch (action) {
            case Action.Down:
                position.y = position.y + 1;
                break;
            case Action.Up:
                position.y = position.y - 1;
                break;
            case Action.Left:
                position.x = position.x - 1;
                break;
            case Action.Right:
                position.x = position.x + 1;
            default:
                break;
        }
        this.props.setPosition(position, action);
    }

    private GetCoordinates(player?: Player): CSSProperties {
        let position: Location;
        switch (player) {
            case Player.Sender:
                position = this.props.senderGoal;
                break;
            case Player.Receiver:
                position = this.props.receiverGoal;
                break;
            default:
                position = this.props.position;
                break;
        }
        return {
            gridColumnStart: position.x,
            gridRowStart: position.y
        }
    }

    public render() {
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
                        hidden={this.props.gameState !== GameState.Sender}
                    />
                    <span
                        id='receiver'
                        className='circle player'
                        style={this.GetCoordinates()}
                        hidden={this.props.gameState !== GameState.Receiver}
                    />
                    <span
                        className='senderGoal player'
                        style={this.GetCoordinates(Player.Sender)}
                        hidden={this.props.gameState === GameState.Success ||
                            this.props.gameState === GameState.Failure ||
                            this.props.gameState === GameState.Receiver}
                    />
                    <span
                        className='receiverGoal player'
                        style={this.GetCoordinates(Player.Receiver)}
                        hidden={this.props.gameState === GameState.Success ||
                            this.props.gameState === GameState.Failure ||
                            this.props.gameState === GameState.Receiver}
                    />
                </div>
            </div>
        );
    }
}