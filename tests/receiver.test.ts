import Receiver from '../src/agents/Receiver';
import Location from '../src/models/Location';

describe('Testing receiver', () => {
    it("getMove", () => {
        const receiver = new Receiver();
        const path = [Location.New(1,1), Location.New(1,2)]
        receiver.getMove(path);
    })
});