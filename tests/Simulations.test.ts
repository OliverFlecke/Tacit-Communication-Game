import Game from '../src/game/Game';
import Statistics from '../src/models/Statistics';
import PlayerType from '../src/models/PlayerType';
import GameState from '../src/models/GameState';
import Strategy from '../src/game/Strategy';

describe('Simulating two agents playing against each other', () => {
    let game: Game;

    beforeEach(() => {
        game = new Game();
    }, 0);

    afterEach(() => {
        // Display simulation results
        const stats: Statistics = game.statistics;
        const numRounds = stats.failures + stats.successes;
        console.log(`Number of rounds: ${numRounds} \tSuccesses: ${stats.successes} \tFailures: ${stats.failures}`);
        console.log(`Receiver map of successes: ${game.numberOfSolvedRounds}`)

    }, 0);

    test('0-ToM sender and 0-ToM receiver', () => {
        // Setup game
        const rounds = 100;
        const senderType = PlayerType.ZeroOrder;
        const receiverType = PlayerType.FirstOrder;
        const strategy = Strategy.ShortestGoalPath;

        game.senderType = senderType;
        game.receiverType = receiverType;
        game.strategy = strategy;

        // Assert correct setup
        expect(game.sender).toBeDefined();
        expect(game.receiver).toBeDefined();
        expect(game.senderType).toEqual(senderType);
        expect(game.receiverType).toEqual(receiverType);
        expect(game.strategy).toEqual(strategy);

        // Run simulations
        let roundsSinceLastSuccess = 0;
        let i = 0;
        // while (true) {
        while (i < rounds) {
            game.simulateRound();
            if (game.numberOfSolvedRounds >= 81) { break; }
            i++;

            // Stop early if it looks like something have gone wrong
            if (game.getFinalGameState() === GameState.Success) {
                roundsSinceLastSuccess = 0;
            }
            else {
                roundsSinceLastSuccess++;
            }
            if (roundsSinceLastSuccess > 100) {
                fail(`Simulation have failed 100 rounds in a row. Stopping...`);
            }
        }

        // Assert
        expect(game.numberOfSolvedRounds).toEqual(81);
    });
});