import Location from './Location';

enum Action {
    Up,
    Down,
    Left,
    Right,
    Start,
    Finish,
    NoOp,
}

export function locationsToAction(start: Location, end: Location) : Action {
    if (start.x === end.x) {
        if (start.y === end.y - 1) return Action.Down;
        else if (start.y === end.y + 1) return Action.Up;
    }
    else if (start.y === end.y) {
        if (start.x === end.x - 1) return Action.Right;
        else if (start.x === end.x + 1) return Action.Left;
    }
    return Action.NoOp;
}
export default Action;