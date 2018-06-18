import * as prolog from '../prolog';
// import Agents from './Agents';
import Location from "../models/Location";
import Round from "../models/Round";
import LocationMap from '../models/LocationMap';
import {
    mapToPrologString,
    // stringToLocation,
} from '../models/Util';
import PlayerType from '../models/PlayerType';
import Strategy from '../game/Strategy';

export default class Sender {

    // private readonly agentType = Agents.Sender;
    public mind: PlayerType = PlayerType.ZeroOrder;

    private _successes: LocationMap<Location> = new LocationMap<Location>();

    public getPath(round: Round, strategy: Strategy,
            callback: (data: any) => void) {
        const mapString = mapToPrologString(this._successes);
        //C, R, SG, P, OR, S, M
        const query = 'getSenderMove((2,2), ' + //CurrentLocation
            round.receiverGoal.toString() + ', ' + //ReceiverGoalLocation
            round.senderGoal.toString() + ', ' + //SenderGoalLocation
            'X, ' + //Path
            this.mind + ', ' + //Order
            strategy + ', ' + //Strategy
            mapString + //Map
            ')';
        console.log(`Sender query: ${query}`);

        const formatResult = (result) => {
            // console.log(result);
            const locations = result.data[0].map(element => {
                const x = element.args[0];
                const y = element.args[1];
                return new Location(x, y);
            });
            callback(Location.pathToActions(locations));
        }

        prolog.execute(query, formatResult);
    }

    public addSuccess(path: Location[], location: Location) {
        if (!this._successes.get(path)) {
            this._successes.set(path, location);
        }
    }
}