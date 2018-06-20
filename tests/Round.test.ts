import Round from "../src/models/Round";
import Location from "../src/models/Location";
import Setting from "../src/game/Setting";

describe('Test how rounds work', () => {
    test('can compare two rounds base on the goal location', () => {
        const l1 = new Location(1, 1);
        const l2 = new Location(2, 3);
        const a = new Round(l1, l2);
        const b = new Round(l1, l2);
        expect(Round.equals(a, b)).toBeTruthy();
    });

    test('Can generate all possible unique rounds', () => {
        const rounds = Round.generateUniqueRounds([]);
        expect(rounds.length).toEqual(81);
    });

    test('All rounds generate are unique', () => {
        const rounds = Round.generateUniqueRounds([]);
        for (let i = 0; i < rounds.length; i++) {
            for (let j = 0; j < rounds.length; j++) {
                if (i === j) continue;

                if (Round.equals(rounds[i], rounds[j])) {
                    fail('None of the rounds can be the same');
                }
            }
        }
    });

    test('Can filter away already tested rounds', () => {
        const round = new Round(new Location(1, 1), new Location(1, 1));
        const oldRounds = Round.generateUniqueRounds([]);
        const newRounds = Round.generateUniqueRounds(oldRounds.filter(x => !Round.equals(round, x)));

        // Assert
        expect(newRounds.length).toEqual(1);
        expect(Round.equals(newRounds[0], round)).toBeTruthy();
    });

    test('Can get a unique round', () => {
        const round = Round.getUniqueRound();
        expect(round).toBeDefined();
    });

    test('Can get the last remaining unique round', () => {
        const round = new Round(new Location(1, 1), new Location(1, 1));
        const oldRounds = Round.generateUniqueRounds([]);
        const newRound = Round.getUniqueRound(oldRounds.filter(x => !Round.equals(round, x)));

        // Assert
        expect(Round.equals(newRound, round)).toBeTruthy();
    });

});

describe('Generate rounds following the simple setting', () => {
    test.only('There should only be 56 rounds', () => {
        const rounds = Round.generateUniqueRounds([], Setting.NoMiddleNotSame);
        expect(rounds.length).toEqual(56);
        expect(rounds).not.toContainEqual(new Round(new Location(2, 2), new Location(2, 2)));
        expect(rounds).not.toContainEqual(new Round(new Location(2, 2), new Location(1, 1)));
        expect(rounds).not.toContainEqual(new Round(new Location(1, 1), new Location(1, 1)));
        expect(rounds).not.toContainEqual(new Round(new Location(1, 1), new Location(2, 2)));
    });
});
