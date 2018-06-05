import React, { CSSProperties } from 'react';
import { Action } from './Action';
import './css/game.css';
import { Location } from './Location';
import { Player } from './Player';

interface IGameState {
    position: Location;
    path: Action[];
}

export class Game extends React.Component<{}, IGameState> {

    private readonly gameSize = 3;

    public constructor(props) {
        super(props);
        this.state = {
            position: new Location(2, 2),
            path: []
        }
    }

    // tslint:disable-next-line:no-empty
    componentDidUpdate() {

    }

    /**
     * KeyboardInput
     */
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

    private IsValidAction(action: Action, player: Player): boolean {
        const position = this.state.position;
        switch (action) {
            case Action.Right:  return position.x < this.gameSize;
            case Action.Left:   return position.x > 1;
            case Action.Up:     return position.y > 1;
            case Action.Down:   return position.y < this.gameSize;
            default:            return false;
        }
    }

    private UpdateLocation(action: Action, player: Player) {
        if (!this.IsValidAction(action, player)) {
            return;
        }

        const position: Location = this.state.position;
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
        const path = this.state.path.concat(action);
        this.setState({
            position,
            path
        });
    }

    private FinishTurn(event: React.MouseEvent<HTMLButtonElement>) {
        console.log('finish turn');
    }

    private GetCoordinates(player: Player): CSSProperties {
        return {
            gridColumnStart: this.state.position.x,
            gridRowStart: this.state.position.y
        }
    }

    private renderGrid() {
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
                        style={this.GetCoordinates(Player.Sender)}
                    />
                </div>
            </div>
        );
    }

    public render() {
        return (
            <div>
                {this.renderGrid()}
                <button onClick={this.FinishTurn}>Finish</button>
            </div>
        );
    }
}