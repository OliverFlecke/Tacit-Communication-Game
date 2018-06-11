import * as prolog from '../prolog';
import IAgent from './IAgent';
import Agents from './Agents';
import Location from '../models/Location';
import LocationMap from '../models/LocationMap';
import {
    locationsToPrologString,
    mapToPrologString,
    stringToLocation
} from '../models/Util';
import PlayerType from '../models/PlayerType';

export default class Receiver implements IAgent {

    private readonly agentType = Agents.Receiver;
    public mind = PlayerType.ZeroOrder;

    private errors: LocationMap<Set<Location>> = new LocationMap<Set<Location>>();
    private _successes: LocationMap<Location> = new LocationMap<Location>();
    public get successes() {
        return this._successes;
    }

    /**
     * Get the next location to move to
     */
    public getMove(path: Location[]): Location {
        const pathString = locationsToPrologString(path);
        const errorsString = locationsToPrologString(Array.from(this.errors.get(path) || []));
        const mapString = mapToPrologString(this._successes);

        // Create query
        const query = "getReceiverMove(" +
            pathString + ", " +
            errorsString + ", " +
            mapString + ", X, " +
            this.mind +
            ", 0" +     // Strategy
            ").";
        let answers = prolog.execute(this.agentType, query);

        const answer: string = answers[0];
        return stringToLocation(answer);
    }


    public addError(path: Location[], location: Location) {
        let set = this.errors.get(path);
        if (!set) {
            set = new Set<Location>();
            this.errors.set(path, set);
        }
        set.add(location);
    }

    public addSuccess(path: Location[], location: Location) {
        if (!this._successes.get(path)) {
            this._successes.set(path, location);
        }
    }
}