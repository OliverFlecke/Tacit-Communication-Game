import * as prolog from '../prolog';
import IAgent from 'src/agents/IAgent';
import Location from 'src/models/Location';
import Agents from 'src/agents/Agents';
import LocationMap from '../models/LocationMap';

export default class Receiver implements IAgent {

    private readonly filepath = Agents.Receiver;

    private errors: LocationMap<Set<Location>> = new LocationMap<Set<Location>>();
    private map: LocationMap<Location> = new LocationMap<Location>();

    public locationsToPrologString(locations: Location[]): string {
        return "[" + locations.map(location => location.toString()).join(',') + "]";
    }

    public mapToPrologString(map: LocationMap<Location>): string {
        let text: string[] = [];
        map.forEach((v, k) => {
            const location = new Location(v);
            text.push('{' + this.locationsToPrologString(k) + ', ' + location.toString() + '}');
        });
        return "[" + text.join(',') + "]";
    }

    public getMove(path: Location[]): Location {
        const pathString = this.locationsToPrologString(path);
        let errorsString = '[]';
        console.log(this.errors);
        console.log(this.errors.has(path));
        let errors = Array.from(this.errors.get(path) || []);
        errorsString = this.locationsToPrologString(errors);
        const mapString = this.mapToPrologString(this.map);
        const query = "getMove(" + pathString + ", " + errorsString + ", " + mapString + ", X).";
        console.log(query);
        let answers = prolog.execute(this.filepath, query);
        console.log(answers[0]);
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