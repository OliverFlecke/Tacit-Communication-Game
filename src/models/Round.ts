import Location from './Location';
import Action from './Action';

/**
 * Represents a round of the Tacit Communication Game
 */
export default class Round {

    private _senderLocation : Location;
    public get senderLocation() : Location {
        return this._senderLocation;
    }
    public set senderLocation(v : Location) {
        this._senderLocation = v;
    }

    private _receiverLocation : Location;
    public get receiverLocation() : Location {
        return this._receiverLocation;
    }
    public set receiverLocation(v : Location) {
        this._receiverLocation = v;
    }

    private _senderGoal : Location;
    public get senderGoal() : Location {
        return this._senderGoal;
    }

    private _receiverGoal : Location;
    public get receiverGoal() : Location {
        return this._receiverGoal;
    }

    private _senderPath : Action[];
    public get senderPath() : Action[] {
        return this._senderPath;
    }
    public set senderPath(v : Action[]) {
        this._senderPath = v;
    }

    constructor(senderGoal?: Location, receiverGoal?: Location) {
        this._senderGoal = senderGoal ? senderGoal : this.CreateRandomPoint(3, 3);
        this._receiverGoal = receiverGoal ? receiverGoal : this.CreateRandomPoint(3, 3);
        this._receiverLocation = new Location();
        this._senderLocation = new Location();
        this._senderPath = [];
    }

    public CreateRandomPoint(xmax: number, ymax: number): Location {
        const x = Math.round((Math.random() * (xmax - 1))) + 1;
        const y = Math.round((Math.random() * (ymax - 1))) + 1;
        return new Location(x, y);
    }

    public success() {
        return Location.equals(this.senderGoal, this.senderLocation) &&
            Location.equals(this.receiverGoal, this.receiverLocation);
    }

    public static equals(a: Round, b: Round): boolean {
        return Location.equals(a.senderGoal, b.senderGoal)
            && Location.equals(a.receiverGoal, b.receiverGoal);
    }

    public static getUniqueRound(rounds?: Round[]): Round {
        const allRounds = Round.generateUniqueRounds(rounds);
        return allRounds[Math.floor(Math.random() * allRounds.length)];
    }

    /**
     * Generate all unique rounds. Subtract rounds that are being passed
     * to the function
     * @param rounds Rounds that should not be generated
     * @returns All the unique rounds, which is not in rounds
     */
    public static generateUniqueRounds(rounds?: Round[]): Round[] {
        let allRounds: Round[] = [];

        for (let sx = 1; sx <= 3; sx++) {
            for (let sy = 1; sy <= 3; sy++) {
                for (let rx = 1; rx <= 3; rx++) {
                    for (let ry = 1; ry <= 3; ry++) {
                        allRounds = allRounds.concat(new Round(new Location(sx, sy), new Location(rx, ry)));
                    }
                }
            }
        }

        if (rounds && rounds.length > 0) {
            allRounds = allRounds.filter(x => !rounds.some(y => Round.equals(x, y)));
        }
        return allRounds;
    }
}
