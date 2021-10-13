import PlayCard from "../../model/PlayCard";
import Event from "../Event";
import {RoundState} from "../../model/RoundState";

export default class DixitRoundPlayerGuessingEvent extends Event {
    public readonly roundState: RoundState;
    public readonly playCards: Array<PlayCard>;

    constructor({gameId, rounds, playerId, roundState, playCards}: {
        gameId: string, rounds: number, playerId: string,
        roundState: RoundState, playCards: Array<PlayCard>
    }) {
        super(gameId, rounds, playerId);
        this.roundState = roundState;
        this.playCards = playCards;
    }
}