import * as prolog from '../src/prolog';

describe('Testing the pengine interface', () => {
    test('path conversion', async () => {

        const callback = (data) => {
            console.log('In callback');
            console.log(data);

            expect(data).toBeDefined();
        }
        prolog.execute('getSenderMove((2,2), (1, 1), (2, 2), X, 0, 1, [])', callback);
    });
});
