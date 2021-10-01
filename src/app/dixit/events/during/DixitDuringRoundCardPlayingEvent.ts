import Event from "../Event";
import {RoundState} from "../../model/RoundState";
import PlayCard from "../../model/PlayCard";

export default class DixitDuringRoundCardPlayingEvent extends Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string,
                public readonly roundState: RoundState,
                public readonly playCards: Array<PlayCard>) {
        super(gameId, rounds, playerId);
    }
}