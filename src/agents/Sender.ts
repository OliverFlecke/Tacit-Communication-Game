import * as prolog from '../prolog';
import Agents from './Agents';
import Location from "../models/Location";
import Round from "../models/Round";
import LocationMap from '../models/LocationMap';
import Action from '../models/Action';
import {
    mapToPrologString,
    stringToLocation,
} from '../models/Util';

export default class Sender {

    private readonly agentType = Agents.Sender;
    private map: LocationMap<Location> = new LocationMap<Location>();

    public getPath(round: Round) : Action[] {
        const mapString = mapToPrologString(this.map);
        //C, R, SG, P, OR, S, M
        const query = 'getSenderMove((2,2), ' + //CurrentLocation
            round.receiverGoal.toString() + ', ' + //ReceiverGoalLocation
            round.senderGoal.toString() + ', ' + //SenderGoalLocation
            'X, ' + //Path
            '1, ' + //Order
            '0, ' + //Strategy
            mapString + //Map
            ').';
        let answers = prolog.execute(this.agentType, query);
        const answer: string = answers[0];
        console.log(answer);
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