import Event from "../Event";
import {RoundState} from "../../model/RoundState";
import Story from "../../model/Story";
import PlayCard from "../../model/PlayCard";

export default class DixitRoundCardPlayingEvent extends Event {
    public readonly roundState: RoundState;
    public readonly story: Story;
    public readonly playCards: Array<PlayCard>;

    constructor({gameId, rounds, playerId, roundState, story, playCards}: {
        gameId: string, rounds: number, playerId: string,
        roundState: RoundState, story: Story, playCards: Array<PlayCard>
    }) {
        super(gameId, rounds, playerId);
        this.roundState = roundState;
        this.story = story;
        this.playCards = playCards;
    }
}