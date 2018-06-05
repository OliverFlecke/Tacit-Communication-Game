import React, { CSSProperties } from 'react';
import { Action } from './Action';
import './css/game.css';
import { Location } from './Location';
import { Player } from './Player';

interface IGameState {
    position: Location;
}

export class Game extends React.Component<{}, IGameState> {

    public table;

    public constructor(props) {
        super(props);
        this.state = {
            position: new Location(2, 2)
        }
    }

    /**
     * KeyboardInput
     */
    public onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
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

    public UpdateLocation(action: Action, player: Player) {
        const position: Location = this.state.position;
        switch (action) {
            case Action.Down:
                position.y = Math.min(3, position.y + 1);
                break;
            case Action.Up:
                position.y = Math.max(1, position.y - 1);
                break;
            case Action.Left:
                position.x = Math.max(1, position.x - 1);
                break;
            case Action.Right:
                position.x = Math.min(3, position.x + 1);
            default:
                break;
        }
        this.setState({
            position
        });
    }


    public render() {
        return (
            <div
                className='game-container'
                tabIndex={0}
                onKeyDown={this.onKeyDown}
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
                        className='square'
                        style={this.getCoordinates(Player.Sender)}
                    />
                </div>
            </div>
        );
    }

    public getCoordinates(player: Player): CSSProperties {
        return {
            gridColumnStart: this.state.position.x,
            gridRowStart: this.state.position.y
        }
    }
}