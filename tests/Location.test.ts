import Location from '../src/models/Location';

describe('Testing location', () => {

    test('Creating location', () => {
        const location = new Location(0, 0);
        expect(location.x).toEqual(0);
        expect(location.y).toEqual(0);
    });

    test('Compare locations', () => {
        const a = new Location(1, 1);
        const b = new Location(1, 1);
        expect(Location.equals(a, b)).toBeTruthy();
    });

    test.skip('Compare array of locations', () => {
        const a = [new Location(1, 1), new Location(1, 2)];
        const b = [new Location(1, 1), new Location(1, 2)];
        expect(a === b).toBeTruthy();
    });

    test('Can create a location from a generic object', () => {
        const obj = { _x: 1, _y: 3 };
        const location = Location.New(obj);
        expect(location.x).toEqual(1);
        expect(location.y).toEqual(3);
    });

    test('A default location is returned if an invalid object is supplied', () => {
        const obj = { _x: 1 };
        const location = Location.New(obj);
        expect(location.x).toEqual(1);
        expect(location.y).toEqual(0);
    });

    test('An location is created from a empty object', () => {
        const obj = {};
        const location = Location.New(obj);
        expect(location.x).toEqual(0);
        expect(location.y).toEqual(0);
    });
});