import Event from "../Event";
import {RoundState} from "../../model/RoundState";
import Player from "../../model/Player";

export default class DixitRoundScoringEvent extends Event {
    public readonly roundState: RoundState;
    public readonly players: Array<Player>

    constructor({gameId, rounds, playerId, roundState, players}: {
        gameId: string, rounds: number, playerId: string,
        roundState: RoundState, players: Array<Player>
    }) {
        super(gameId, rounds, playerId);
        this.roundState = roundState;
        this.players = players;
    }
}