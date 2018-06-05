import React from 'react';
import ReactDOM from 'react-dom';
import { Action } from './Action';
import './css/index.css';
import { Location } from './Location';
import { Player } from './Player';
import registerServiceWorker from './registerServiceWorker';


interface IGameState {
    position: Location;
}

class Game extends React.Component<{}, IGameState> {

    public table;

    public constructor(props) {
        super(props);
        this.state = {
            position: new Location(1, 1)
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
            <table>
                <tbody
                    tabIndex={0}
                    onKeyDown={this.onKeyDown}
                >
                    <tr>
                        <td className='header'/>
                        <td className='header'>1</td>
                        <td className='header'>2</td>
                        <td className='header'>3</td>
                    </tr>
                    <tr>
                        <td className='header'>1</td>
                        <td>{this.showShape(1,1)}</td>
                        <td>{this.showShape(2,1)}</td>
                        <td>{this.showShape(3,1)}</td>
                    </tr>
                    <tr>
                        <td className='header'>2</td>
                        <td>{this.showShape(1,2)}</td>
                        <td>{this.showShape(2,2)}</td>
                        <td>{this.showShape(3,2)}</td>
                    </tr>
                    <tr>
                        <td className='header'>3</td>
                        <td>{this.showShape(1,3)}</td>
                        <td>{this.showShape(2,3)}</td>
                        <td>{this.showShape(3,3)}</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    public showShape(x: number, y: number) {
        if (x !== this.state.position.x || y !== this.state.position.y) {
            return;
        }
        return (
            <div className='box'/>
        );
    }

}

ReactDOM.render(<Game />, document.getElementById('root'));
registerServiceWorker();