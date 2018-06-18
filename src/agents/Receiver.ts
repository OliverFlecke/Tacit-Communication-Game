import * as prolog from '../prolog';
import Location from '../models/Location';
import LocationMap from '../models/LocationMap';
import {
    locationsToPrologString,
    mapToPrologString,
} from '../models/Util';
import PlayerType from '../models/PlayerType';
import Strategy from '../game/Strategy';

export default class Receiver {

    public mind = PlayerType.ZeroOrder;

    private errors: LocationMap<Set<Location>> = new LocationMap<Set<Location>>();
    private _successes: LocationMap<Location> = new LocationMap<Location>();
    public get successes() {
        return this._successes;
    }

    /**
     * Get the next location to move to
     */
    public getMove(path: Location[], strategy: Strategy,
            callback: (data: any) => void) {
        const pathString = locationsToPrologString(path);
        const errorsString = locationsToPrologString(Array.from(this.errors.get(path) || []));
        const mapString = mapToPrologString(this._successes);

        // Create query
        const query = "getReceiverMove(" +
            pathString + ", " +
            errorsString + ", " +
            mapString + ", " +
            "X, " +
            this.mind + ", " +
            strategy + // Strategy
            ")";
        // console.log(`Receiver query: ${query}`);

        const formatAnswers = (result) => {
            const answers = result.data[0];
            // console.log('Receiver: ' + answers);

            let answer;
            if (Object.prototype.toString.call(answers) === '[object Array]') {
                answer = answers[0];
            } else {
                answer = answers;
            }
            const x = answer.args[0];
            const y = answer.args[1];
            const location = new Location(x, y);

            callback(location);
        };
        prolog.execute(query, formatAnswers);
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