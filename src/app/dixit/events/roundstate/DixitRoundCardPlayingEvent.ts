import Card from "../../model/Card";
import Event from "../Event";
import {RoundState} from "../../model/RoundState";
import Story from "../../model/Story";

export default class DixitRoundCardPlayingEvent extends Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string,
                public readonly roundState: RoundState,
                public readonly story: Story,
                public readonly handCards: Array<Card>) {
        super(gameId, rounds, playerId);
    }
}