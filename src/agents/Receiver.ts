import * as prolog from '../prolog';
import IAgent from 'src/agents/IAgent';
import Location from 'src/models/Location';
import Agents from 'src/agents/Agents';
import LocationMap from '../models/LocationMap';
import { locationsToPrologString, mapToPrologString } from 'src/models/Util';

export default class Receiver implements IAgent {

    private readonly filepath = Agents.Receiver;

    private errors: LocationMap<Set<Location>> = new LocationMap<Set<Location>>();
    private map: LocationMap<Location> = new LocationMap<Location>();

    /**
     * Get the next location to move to
     */
    public getMove(path: Location[]): Location {
        const pathString = locationsToPrologString(path);
        const errorsString = locationsToPrologString(Array.from(this.errors.get(path) || []));
        const mapString = mapToPrologString(this.map);

        // Create query
        const query = "getMove(" + pathString + ", " + errorsString + ", " + mapString + ", X).";
        let answers = prolog.execute(this.filepath, query);

        const answer: string = answers[0];
        const regex = new RegExp('[1-9]', 'g');
        const matches = answer.match(regex);

        if (matches) {
            return Location.convertFromString(matches);
        }
        return Location.New();
    }


    public addError(path: Location[], location: Location) {
        console.log(this.errors);
        let set = this.errors.get(path);
        if (!set) {
            set = new Set<Location>();
            this.errors.set(path, set);
        }
        set.add(location);
        console.log(this.errors);
    }

    public addSuccess(path: Location[], location: Location) {
        if (!this.map.get(path)) {
            this.map.set(path, location);
        }
    }
}