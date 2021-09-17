import Player from "../Player";
import Event from "./Event";
import {GameState} from "../GameState";

export default class DixitGameOverEvent extends Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string,
                public readonly gameState: GameState,
                public readonly winners: Array<Player>) {
        super(gameId, rounds, playerId);
    }
}