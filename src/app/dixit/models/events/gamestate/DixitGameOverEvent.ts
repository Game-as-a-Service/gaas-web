import Player from "../../model/Player";
import Event from "../Event";
import {GameState} from "../../model/GameState";

export default class DixitGameOverEvent extends Event {
    public readonly gameState: GameState;
    public readonly winners: Array<Player>;

    constructor({gameId, rounds, playerId, gameState, winners}: {
        gameId: string, rounds: number, playerId: string, gameState: GameState, winners: Array<Player>
    }) {
        super(gameId, rounds, playerId);
        this.gameState = gameState;
        this.winners = winners;
    }
}