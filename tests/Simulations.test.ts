import Game from '../src/game/Game';
import Statistics from '../src/models/Statistics';
import PlayerType from '../src/models/PlayerType';

describe('Simulating two agents playing against each other', () => {
    it('0-ToM sender and 0-ToM receiver', () => {
        // Setup game
        const rounds = 400;
        const game = new Game();
        game.senderType = PlayerType.FirstOrder;
        game.receiverType = PlayerType.ZeroOrder;

        // Run simulations
        // for (let i = 0; i < rounds; i++) {
        //     game.simulateRound();
        //     if (game.receiver.successes.size >= 81) {
        //         break;
        //     }
        // }
        while (true) {
            game.simulateRound();
            if (game.receiver.successes.size >= 81) break;
        }

        // Display simulation results
        const stats: Statistics = game.statistics;
        console.log(`Successes: ${stats.successes} \tFailures: ${stats.failures}`);
        console.log(`Receiver map of successes: ${game.receiver.successes.size}`)
    })
});