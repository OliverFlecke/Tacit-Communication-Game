import Location from './Location';
import LocationMap from './LocationMap';

export function locationsToPrologString(locations: Location[]): string {
    return "[" + locations.map(location => location.toString()).join(',') + "]";
}

export function mapToPrologString(map: LocationMap<Location>): string {
    let text: string[] = [];
    map.forEach((v, k) => {
        const location = new Location(v);
        text.push('{' + locationsToPrologString(k) + ', ' + location.toString() + '}');
    });
    return "[" + text.join(',') + "]";
}

export function stringToLocation(text: string) : Location {
    if (typeof text !== 'string') { return Location.New(); }

    const regex = new RegExp('[1-9]', 'g');
    const matches = text.match(regex);

    if (matches) {
        return Location.convertFromString(matches);
    }
    throw new EvalError('String cannot be converted to Location');
}