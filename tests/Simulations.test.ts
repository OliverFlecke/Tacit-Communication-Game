import Game from '../src/game/Game';
import Statistics from '../src/models/Statistics';
import PlayerType from '../src/models/PlayerType';

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
        const rounds = 20;
        game.senderType = PlayerType.FirstOrder;
        game.receiverType = PlayerType.ZeroOrder;

        // Assert correct setup
        expect(game.sender).toBeDefined();
        expect(game.receiver).toBeDefined();
        expect(game.senderType).toEqual(PlayerType.FirstOrder);
        expect(game.receiverType).toEqual(PlayerType.ZeroOrder);

        // Run simulations
        let i = 0;
        while (true) {
        // while (i < rounds) {
            game.simulateRound();
            if (game.numberOfSolvedRounds >= 81) { break; }
            i++;
        }

        // Assert
        expect(game.numberOfSolvedRounds).toEqual(81);
    });
});