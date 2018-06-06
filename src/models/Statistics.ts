/**
 * Tracking the number of successes and failures in the game
 */
export default class Statistics {

    private _successes: number = 0;
    private _failures: number = 0;

    public addSuccess() {
        this._successes++;
    }

    public get successes() : number {
        return this._successes;
    }

    public addFailure() {
        this._failures++;
    }

    public get failures() : number {
        return this._failures;
    }
}