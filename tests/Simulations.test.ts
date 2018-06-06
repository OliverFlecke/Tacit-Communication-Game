import Game from '../src/game/Game';
import Statistics from '../src/models/Statistics';

describe('Simulating two agents playing against each other', () => {
    it('0-ToM sender and 0-ToM receiver', () => {
        const game = new Game();
        for (let i = 0; i < 100; i++) {
            game.startRound();
            game.update();
            game.newRound();
        }
        const stats: Statistics = game.statistics;
        console.log(`Successes: ${stats.successes} \tFailures: ${stats.failures}`);
    })
});