
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
        this.x = x || 0;
        this.y = y || 0;
    }

    public static equals(a: Location, b: Location) {
        return a.x === b.x && a.y === b.y;
    }

}