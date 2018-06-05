import React from 'react';
import GameGrid from 'src/GameGrid';
import Round from 'src/Round';
import GameState from 'src/GameState';
import Action from 'src/Action';
import Location from 'src/Location';

// tslint:disable-next-line:no-empty-interface
interface IGameState {
    round: Round;
    gameState: GameState;
    position: Location;
    path: Action[];
}

export class Game extends React.Component<{}, IGameState> {

    public constructor(props) {
        super(props);
        this.state = this.generateRound();
    }

    private finishTurn  = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log('finish turn');
        if (this.state.gameState === GameState.Sender) {
            const round = this.state.round;
            round.senderLocation = this.state.position;
            console.log(this.state.round);

            console.log(this.state.round);
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
            console.log(this.state.round);
            console.log(this.state.round.success())
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
        this.setState({
            ...this.state,
            gameState: GameState.Sender
        })
    }

    private setPosition = (position: Location, action: Action) => {
        const path = this.state.path.concat(action);
        this.setState({
            ...this.state,
            position,
            path
        })
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
                />
                <button onClick={this.finishTurn}>Finish</button>
                <button onClick={this.newRound}>New round</button>
                <button onClick={this.startRound}>Start round</button>
                <div
                    className={`message ${this.state.gameState === GameState.Success ? 'success' : 'failure'}`}
                />
            </div>
        );
    }
}