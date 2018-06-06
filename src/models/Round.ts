import Location from 'src/models/Location';
import Action from 'src/models/Action';

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

    constructor() {
        this._senderGoal = this.CreateRandomPoint(3,3);
        this._receiverGoal = this.CreateRandomPoint(3,3);
        this._receiverLocation = Location.New();
        this._senderLocation = Location.New();
        this._senderPath = [];
    }

    public CreateRandomPoint(xmax: number, ymax: number): Location {
        const x = Math.round((Math.random() * (xmax - 1))) + 1;
        const y = Math.round((Math.random() * (ymax - 1))) + 1;
        return Location.New(x, y);
    }

    public success() {
        return Location.equals(this.senderGoal, this.senderLocation) &&
            Location.equals(this.receiverGoal, this.receiverLocation);
    }
}
