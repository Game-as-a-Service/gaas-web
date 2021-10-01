import Event from "../Event";
import {RoundState} from "../../model/RoundState";
import Player from "../../model/Player";

export default class DixitRoundStoryTellingEvent extends Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string,
                public readonly roundState: RoundState,
                public readonly storyteller: Player) {
        super(gameId, rounds, playerId);
    }
}