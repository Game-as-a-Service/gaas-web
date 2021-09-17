import Guess from "../Guess";
import Event from "./Event";
import Story from "../Story";
import {RoundState} from "../RoundState";
import PlayCard from "../PlayCard";

export default class DixitRoundScoringEvent extends Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string,
                public readonly roundState: RoundState,
                public readonly story: Story,
                public readonly playCards: Array<PlayCard>,
                public readonly guesses: Array<Guess>) {
        super(gameId, rounds, playerId);
    }
}