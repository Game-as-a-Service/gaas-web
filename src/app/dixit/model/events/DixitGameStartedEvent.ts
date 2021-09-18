import Player from "../domain/Player";
import Event from "./Event";
import {GameState} from "../domain/GameState";

export default class DixitGameStartedEvent extends Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string,
                public readonly gameState: GameState,
                public readonly players: Array<Player>) {
        super(gameId, rounds, playerId);
    }
}