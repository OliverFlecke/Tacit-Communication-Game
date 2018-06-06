import Round from "src/models/Round";
import GameState from "src/models/GameState";
import PlayerType from "src/models/PlayerType";
import Action from "src/models/Action";
import Location from "src/models/Location";

export default interface IGameState {
    round: Round;
    gameState: GameState;
    receiverType: PlayerType;
    senderType: PlayerType;
    position: Location;
    path: Action[];
}