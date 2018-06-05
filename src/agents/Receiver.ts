import * as prolog from '../prolog';
import IAgent from 'src/agents/Agent';
import Location from '../models/Location';

export default class Receiver implements IAgent {

    private readonly filepath = 'src/prolog/receiver.pl';

    private errors: Location[] = [];
    // private map: Map<Location[], Location> = new Map<Location[], Location>();

    public locationsToPrologString(locations: Location[]): string {
        return "[" + locations.map(location => `(${location.x}, ${location.y})`).join(',') + "]";
    }

    public getMove(path: Location[]): Location {
        const mapString = this.locationsToPrologString(path);
        const errorsString = this.locationsToPrologString(this.errors);
        const query = "getMove(" + mapString + ", " + errorsString + ", [], X).";
        console.log(query);
        let answers = prolog.execute(this.filepath, query);
        console.log(answers[0]);
        const answer: string = answers[0];
        const regex = new RegExp('[1-9]', 'g');
        const matches = answer.match(regex);
        console.log(matches);

        if (matches) {
            const location = Location.convertFromString(matches);
            console.log(location);
            return location;
        }
        return new Location();
    }

    addError: any;
    addSuccess: any;
}