import Event from "./Event";
import Player from "../Player";
import {RoundState} from "../RoundState";

export default class DixitRoundOverEvent extends Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string,
                public readonly roundState: RoundState,
                public readonly players: Array<Player>) {
        super(gameId, rounds, playerId);
    }
}