import Card from "../../model/Card";
import Event from "../Event";
import {RoundState} from "../../model/RoundState";
import Story from "../../model/Story";

export default class DixitRoundCardPlayingEvent extends Event {
    public readonly roundState: RoundState;
    public readonly story: Story;
    public readonly handCards: Array<Card>;

    constructor({gameId, rounds, playerId, roundState, story, handCards}: {
        gameId: string, rounds: number, playerId: string,
        roundState: RoundState, story: Story, handCards: Array<Card>
    }) {
        super(gameId, rounds, playerId);
        this.roundState = roundState;
        this.story = story;
        this.handCards = handCards;
    }
}