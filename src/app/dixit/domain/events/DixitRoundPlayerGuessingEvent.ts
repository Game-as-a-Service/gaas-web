import PlayCard from "../PlayCard";
import Event from "./Event";
import {RoundState} from "../RoundState";

export default class DixitRoundPlayerGuessingEvent extends Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string,
                public readonly roundState: RoundState,
                public readonly playCards: Array<PlayCard>) {
        super(gameId, rounds, playerId);
    }
}