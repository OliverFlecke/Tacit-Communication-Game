import Round from "../models/Round";
import GameState from "../models/GameState";
import PlayerType from "../models/PlayerType";
import Action from "../models/Action";
import Location from "../models/Location";

export default interface IGameState {
    round: Round;
    gameState: GameState;
    receiverType: PlayerType;
    senderType: PlayerType;
    position: Location;
    path: Action[];
}