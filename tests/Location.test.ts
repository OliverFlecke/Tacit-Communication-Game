import Location from '../src/models/Location';

describe("Testing location", () => {
    it("Compare locations", () => {
        const a = new Location(1,1);
        const b = new Location(1,1);
        expect(Location.equals(a, b)).toBeTruthy();
    });

    // it("Compare array of locations", () => {
    //     const a = [new Location(1,1), new Location(1,2)];
    //     const b = [new Location(1,1), new Location(1,2)];
    //     expect(a === b).toBeTruthy();
    // });

    it("Can create a location from a generic object", () => {
        const obj = { _x: 1, _y: 3 };
        const a = Location.New(obj);
        expect(a.x).toEqual(1);
        expect(a.y).toEqual(3);
    });
});