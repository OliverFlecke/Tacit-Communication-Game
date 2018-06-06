import Location from './Location';

export default class LocationMap<V> {
    private map = new Map<string, V>();

    set(key: Location[], value: V): this {
        this.map.set(JSON.stringify(key), value);
        return this;
    }

    get(key: Location[]): V | undefined {
        return this.map.get(JSON.stringify(key));
    }

    clear() {
        this.map.clear();
    }

    delete(key: Location[]): boolean {
        return this.map.delete(JSON.stringify(key));
    }

    has(key: Location[]): boolean {
        return this.map.has(JSON.stringify(key));
    }

    get size() {
        return this.map.size;
    }

    forEach(callbackfn: (value: V, key: Location[],
            map: Map<Location[], V>) => void, thisArg?: any): void {
        this.map.forEach((value, key) => {
            const locations: Location[] = [];
            JSON.parse(key).forEach(x => locations.push(new Location(x)));
            callbackfn.call(thisArg, value, locations, this);
        });
    }
}