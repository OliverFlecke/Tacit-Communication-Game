import Location from 'src/models/Location';

interface IAgent {
    getMove: (path: Location[]) => Location;
    addError: (path: Location[], location: Location) => void;
    addSuccess: (path: Location[], location: Location) => void;
}

export default IAgent;