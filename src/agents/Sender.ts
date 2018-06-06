import Location from "src/models/Location";
import Round from "src/models/Round";

export default class Sender {

    public getMove(round: Round) : Location {
        throw new EvalError('Not implemented');
    }

}