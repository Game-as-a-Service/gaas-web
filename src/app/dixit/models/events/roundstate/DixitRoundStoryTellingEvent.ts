import Event from "../Event";
import {RoundState} from "../../model/RoundState";
import Player from "../../model/Player";

export default class DixitRoundStoryTellingEvent extends Event {
    public readonly roundState: RoundState;
    public readonly storyteller: Player;

    constructor({gameId, rounds, playerId, roundState, storyteller}: {
        gameId: string, rounds: number, playerId: string,
        roundState: RoundState, storyteller: Player
    }) {
        super(gameId, rounds, playerId);
        this.roundState = roundState;
        this.storyteller = storyteller;
    }
}