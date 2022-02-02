import PlayCard from "../../model/PlayCard";
import Event from "../Event";
import {RoundState} from "../../model/RoundState";
import Guess from "../../model/Guess";

export default class DixitRoundStoryGuessedEvent extends Event {
    public readonly roundState: RoundState;
    public readonly playCards: Array<PlayCard>;
    public readonly guesses: Array<Guess>;

    constructor({gameId, rounds, playerId, roundState, playCards, guesses}: {
        gameId: string, rounds: number, playerId: string,
        roundState: RoundState, playCards: Array<PlayCard>, guesses: Array<Guess>
    }) {
        super(gameId, rounds, playerId);
        this.roundState = roundState;
        this.playCards = playCards;
        this.guesses = guesses;
    }
}