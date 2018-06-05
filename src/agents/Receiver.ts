import * as prolog from '../prolog';
import IAgent from 'src/agents/IAgent';
import Location from 'src/models/Location';
import Agents from 'src/agents/Agents';

export default class Receiver implements IAgent {

    private readonly filepath = Agents.Receiver;

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


    public addError(path: Location[], location: Location) {
        throw EvalError('Not implemented');
    }

    public addSuccess(path: Location[], location: Location) {
        throw EvalError('Not implemented');
    }
}