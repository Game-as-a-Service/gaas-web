import {GameState} from "./model/GameState";
import {RoundState} from "./model/RoundState";
import Card from "./model/Card";
import Story from "./model/Story";
import PlayCard from "./model/PlayCard";
import Guess from "./model/Guess";

export class DixitContextProp {
    constructor(public readonly dixitId: string,
                public readonly playerId: string,
                public gameState?: GameState,
                public roundState?: RoundState,
                public handCards: Array<Card> = [],
                public story?: Story,
                public playCards: Array<PlayCard> = [],
                public guesses: Array<Guess> = []) {
    }
}