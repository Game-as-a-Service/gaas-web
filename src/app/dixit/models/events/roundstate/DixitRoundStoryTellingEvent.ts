import Event from "../Event";
import {RoundState} from "../../model/RoundState";
import Player from "../../model/Player";
import Card from "../../model/Card";

export default class DixitRoundStoryTellingEvent extends Event {
    public readonly roundState: RoundState;
    public readonly storyteller: Player;
    public readonly handCards: Array<Card>;

    constructor({gameId, rounds, playerId, roundState, storyteller, handCards}: {
        gameId: string, rounds: number, playerId: string,
        roundState: RoundState, storyteller: Player, handCards: Array<Card>
    }) {
        super(gameId, rounds, playerId);
        this.roundState = roundState;
        this.storyteller = storyteller;
        this.handCards = handCards;
    }
}