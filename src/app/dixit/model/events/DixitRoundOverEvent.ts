import Event from "./Event";
import Player from "../domain/Player";
import {RoundState} from "../domain/RoundState";

export default class DixitRoundOverEvent extends Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string,
                public readonly roundState: RoundState,
                public readonly players: Array<Player>) {
        super(gameId, rounds, playerId);
    }
}