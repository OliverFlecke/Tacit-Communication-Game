import * as prolog from '../prolog';
import Location from "src/models/Location";
import Round from "src/models/Round";
import Agents from 'src/agents/Agents';
import LocationMap from '../models/LocationMap';
import {
    mapToPrologString,
    stringToLocation,
} from 'src/models/Util';
import Action from 'src/models/Action';

export default class Sender {

    private readonly agentType = Agents.Sender;
    private map: LocationMap<Location> = new LocationMap<Location>();

    public getPath(round: Round) : Action[] {
        const mapString = mapToPrologString(this.map);

        const query = 'getMove((2,2), ' +
            round.receiverGoal.toString() + ', ' +
            round.senderGoal.toString() + ', ' +
            'X, ' +
            '1, ' +
            mapString +
            ').';
        let answers = prolog.execute(this.agentType, query);
        const answer: string = answers[0];

        const regex = new RegExp('\([1-9], [1-9]\)', 'g');
        const matches = answer.match(regex);
        if (matches) {
            const path: Location[] = [];
            matches.map(v => path.push(stringToLocation(v)));
            const actions = Location.pathToActions(path);
            return actions;
        }
        return [];
    }

}