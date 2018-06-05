
export class Location {

    private px : number = 0;
    public get x() : number {
        return this.px;
    }
    public set x(v : number) {
        this.px = v;
    }

    private py : number = 0;
    public get y() : number {
        return this.py;
    }
    public set y(v : number) {
        this.py = v;
    }

    public constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }
}