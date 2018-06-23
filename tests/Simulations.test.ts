import Game from '../src/game/Game';
import Statistics from '../src/models/Statistics';
import PlayerType from '../src/models/PlayerType';
import GameState from '../src/models/GameState';
import Strategy from '../src/game/Strategy';
import Setting from '../src/game/Setting';
import * as util from './util';

describe('Simulating two agents playing against each other', () => {
    let game: Game;

    beforeEach(() => {
        game = new Game();
    }, 0);

    afterEach(() => {
        // Display simulation results
        printStatistics(game);

    }, 0);

    test('0-ToM sender and 0-ToM receiver with shortest path', async () => {
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

    test.only('Running multiple simulations', async () => {
        jest.setTimeout(2147483647);
        for (let strategy = 1; strategy <= 1; strategy++) {
            for (let sender = 0; sender <= 2; sender++) {
                for (let receiver = 0; receiver <= 2; receiver++) {
                    await runMultipleSimulations(sender, receiver, 2);
                }
            }
        }
        // await runMultipleSimulations(2, 2, Strategy.ShortestPath);
    })

    async function runMultipleSimulations(sender: PlayerType, receiver: PlayerType, strategy: Strategy, count: number = 10) {
        const results = [];
        let i = 1;
        while (i <= count) {
            // console.log(`Simulation ${i}`);
            game = new Game();
            await simulation(sender, receiver, strategy, Setting.NoMiddleNotSame);
            results.push(game.statistics.failures);
            // printStatistics(game);
            i++;
        }
        const average = util.mean(results);
        const standardError = util.standardError(results);
        console.log(`S${sender}R${receiver}: [${results}] (${average}) (${standardError})`);
    }

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
        // jest.setTimeout(rounds * 2000);

        await sleep(2000);

        // Run simulations
        let roundsSinceLastSuccess = 0;
        // tslint:disable-next-line:no-var-keyword
        var counter = 0;
        // tslint:disable-next-line:no-var-keyword
        var active = false;

        // while (true) {
        while (counter < rounds) {
            if (setting === Setting.All) {
                if (game.numberOfSolvedRounds >= 81) { break; }
            } else if (setting === Setting.NoMiddleNotSame) {
                if (game.numberOfSolvedRounds >= 56) { break; }
            }

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
        if (setting === Setting.All) expect(game.numberOfSolvedRounds).toEqual(81);
        if (setting === Setting.NoMiddleNotSame) expect(game.numberOfSolvedRounds).toEqual(56);
    });
});

function printStatistics(game: Game) {
    const stats: Statistics = game.statistics;
    const numRounds = stats.failures + stats.successes;
    console.log(`Sender: ${game.senderType} \tReceiver: ${game.receiverType}`
        + `\nNumber of rounds: ${numRounds} \tSuccesses: ${stats.successes} \tFailures: ${stats.failures}`
        + `\nReceiver map of successes: ${game.numberOfSolvedRounds}`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
