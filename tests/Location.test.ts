import Location from '../src/models/Location';

describe("Testing location", () => {
    it("Compare locations", () => {
        const a = Location.New(1,1);
        const b = Location.New(1,1);
        expect(a).toEqual(b);
    })

    it("Compare array of locations", () => {
        const a = [Location.New(1,1), Location.New(1,2)];
        const b = [Location.New(1,1), Location.New(1,2)];
        expect(a === b).toBeTruthy();
    })
})