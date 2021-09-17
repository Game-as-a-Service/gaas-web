import Card from "../Card";
import Event from "./Event";
import {RoundState} from "../RoundState";

export default class DixitRoundCardPlayingEvent extends Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string,
                public readonly roundState: RoundState,
                public readonly handCards: Array<Card>) {
        super(gameId, rounds, playerId);
    }
}