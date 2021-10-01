import Event from "../Event";
import {RoundState} from "../../model/RoundState";
import PlayCard from "../../model/PlayCard";
import Guess from "../../model/Guess";

export default class DixitDuringRoundPlayerGuessingEvent extends Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string,
                public readonly roundState: RoundState,
                public readonly playCards: Array<PlayCard>,
                public readonly guesses: Array<Guess>) {
        super(gameId, rounds, playerId);
    }
}