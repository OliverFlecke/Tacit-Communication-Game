import Game from '../src/game/Game';
import Statistics from '../src/models/Statistics';
import PlayerType from '../src/models/PlayerType';
import GameState from '../src/models/GameState';
import Strategy from '../src/game/Strategy';
import Setting from '../src/game/Setting';

describe('Simulating two agents playing against each other', () => {
    let game: Game;

    beforeEach(() => {
        game = new Game();
    }, 0);

    afterEach(() => {
        // Display simulation results
        const stats: Statistics = game.statistics;
        const numRounds = stats.failures + stats.successes;
        console.log(`Sender: ${game.receiverType} \tReceiver: ${game.receiverType}`
            + `\nNumber of rounds: ${numRounds} \tSuccesses: ${stats.successes} \tFailures: ${stats.failures}`
            + `\nReceiver map of successes: ${game.numberOfSolvedRounds}`
        );

    }, 0);

    test.only('0-ToM sender and 0-ToM receiver with shortest path', async () => {
        await simulation(PlayerType.ZeroOrder, PlayerType.ZeroOrder, Strategy.ShortestPath);
    });

    test('0-ToM sender and 1-ToM receiver', async () => {
        await simulation(PlayerType.ZeroOrder, PlayerType.FirstOrder, Strategy.ShortestGoalPath);
    });
    test('0-ToM sender and 1-ToM receiver unique path', async () => {
        await simulation(PlayerType.ZeroOrder, PlayerType.FirstOrder, Strategy.UniquePath);
    });

    test('1-ToM sender and 2-ToM receiver, shortest goal path', async () => {
        await simulation(PlayerType.FirstOrder, PlayerType.SecondOrder, Strategy.ShortestGoalPath);
    });

    test('2-ToM sender and 2-ToM receiver, shortest goal path', async () => {
        await simulation(PlayerType.SecondOrder, PlayerType.SecondOrder, Strategy.UniquePath);
    });

    test('2-ToM sender and 1-ToM receiver, shortest goal path', async () => {
        await simulation(PlayerType.SecondOrder, PlayerType.FirstOrder, Strategy.ShortestGoalPath);
    });

    async function simulation(senderType: PlayerType, receiverType: PlayerType, strategy: Strategy, setting = Setting.All) {
        // Setup game
        game.senderType = senderType;
        game.receiverType = receiverType;
        game.strategy = strategy;

        // Assert correct setup
        expect(game.sender).toBeDefined();
        expect(game.receiver).toBeDefined();
        expect(game.senderType).toEqual(senderType);
        expect(game.receiverType).toEqual(receiverType);
        expect(game.strategy).toEqual(strategy);

        const rounds = 1000;
        jest.setTimeout(rounds * 2000);

        await sleep(2000);

        // Run simulations
        let roundsSinceLastSuccess = 0;
        // tslint:disable-next-line:no-var-keyword
        var counter = 0;
        // tslint:disable-next-line:no-var-keyword
        var active = false;

        // while (true) {
        while (counter < rounds) {
            if (game.numberOfSolvedRounds >= 81) { break; }

            if (roundsSinceLastSuccess > 100) {
                fail(`Simulation have failed 100 rounds in a row. Stopping...`);
                break;
            }

            if (!active) {
                game.simulateRound(setting);
                active = true;
                counter++;

                const interval = setInterval(() => {
                    if (game.gameState === GameState.Finished) {
                        active = false;

                        // Stop early if it looks like something have gone wrong
                        if (game.getFinalGameState() === GameState.Success) {
                            roundsSinceLastSuccess = 0;
                        }
                        else {
                            roundsSinceLastSuccess++;
                        }

                        clearInterval(interval);
                    }
                }, 10);
            }

            await sleep(100);
        }

        // Assert
        expect(game.numberOfSolvedRounds).toEqual(81);
    });
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
