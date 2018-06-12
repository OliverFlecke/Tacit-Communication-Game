import Action, { locationsToAction } from "./Action";

export default class Location {

    private _x : number = 0;
    public get x() : number {
        return this._x;
    }
    public set x(v : number) {
        this._x = v;
    }

    private _y : number = 0;
    public get y() : number {
        return this._y;
    }
    public set y(v : number) {
        this._y = v;
    }

    public constructor(x?: number, y?: number) {
        this._x = x || 2;
        this._y = y || 2;
    }

    public static New(obj: any) {
        // tslint:disable-next-line:no-string-literal
        return new Location(obj['_x'], obj['_y']);
    }

    public static equals(a: Location, b: Location): boolean {
        return a.x === b.x && a.y === b.y;
    }

    public static convertFromString(values: string[]): Location {
        const x: number = Number(values[0]);
        const y: number = Number(values[1]);
        return new Location(x, y);
    }

    public static getNextLocation(location: Location, action: Action): Location {
        switch (action) {
            case Action.Up:     return new Location(location.x, location.y - 1);
            case Action.Down:   return new Location(location.x, location.y + 1);
            case Action.Left:   return new Location(location.x - 1, location.y);
            case Action.Right:  return new Location(location.x + 1, location.y);
            default:            return location;
        }
    }

    public static actionsToPath(actions: Action[]): Location[] {
        let locations: Location[] = [];
        let currentLocation = new Location(2,2);
        locations.push(currentLocation);
        actions.forEach(action => {
            currentLocation = this.getNextLocation(currentLocation, action);
            locations.push(currentLocation);
        });

        return locations;
    }

    public static pathToActions(path: Location[]): Action[] {
        if (path.length <= 0) {
            return [];
        }

        let actions: Action[] = [];
        let i = 0;
        do {
            let currentLocation = path[i];
            let nextLocation = path.length>i+1 ? path[i + 1] : path[i];
            actions.push(locationsToAction(currentLocation, nextLocation));
            i++;
        } while(i < path.length - 1)

        return actions;
    }

    public toString = () : string => {
        return `(${this.x}, ${this.y})`;
    }
}