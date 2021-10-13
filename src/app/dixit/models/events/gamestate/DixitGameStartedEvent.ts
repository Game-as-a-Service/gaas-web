import Player from "../../model/Player";
import Event from "../Event";
import {GameState} from "../../model/GameState";

export default class DixitGameStartedEvent extends Event {
    public readonly gameState: GameState;
    public readonly players: Array<Player>;

    constructor({gameId, rounds, playerId, gameState, players}: {
        gameId: string, rounds: number, playerId: string, gameState: GameState, players: Array<Player>
    }) {
        super(gameId, rounds, playerId);
        this.gameState = gameState;
        this.players = players;
    }
}