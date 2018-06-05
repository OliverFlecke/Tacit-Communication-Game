import Receiver from '../src/agents/Receiver';
import Location from '../src/models/Location';

describe('Testing receiver', () => {
    it("getMove", () => {
        const receiver = new Receiver();
        const path = [new Location(1,1), new Location(1,2)]
        receiver.getMove(path);
    })
});