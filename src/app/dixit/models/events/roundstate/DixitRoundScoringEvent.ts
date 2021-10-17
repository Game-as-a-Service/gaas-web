import Guess from "../../model/Guess";
import Event from "../Event";
import {RoundState} from "../../model/RoundState";
import PlayCard from "../../model/PlayCard";
import Player from "../../model/Player";

export default class DixitRoundScoringEvent extends Event {
    public readonly roundState: RoundState;
    public readonly playCards: Array<PlayCard>;
    public readonly guesses: Array<Guess>;
    public readonly players: Array<Player>

    constructor({gameId, rounds, playerId, roundState, playCards, guesses, players}: {
        gameId: string, rounds: number, playerId: string,
        roundState: RoundState, playCards: Array<PlayCard>, guesses: Array<Guess>, players: Array<Player>
    }) {
        super(gameId, rounds, playerId);
        this.roundState = roundState;
        this.playCards = playCards;
        this.guesses = guesses;
        this.players = players;
    }
}