import Player from "./Player";
import PlayCard from "./PlayCard";
import Card from "./Card";

export default class Guess {
    constructor(public readonly guesser: Player,
                public readonly playCard: PlayCard) {
    }

    public get card(): Card {
        return this.playCard.card;
    }

    public get cardPlayer(): Player {
        return this.playCard.player;
    }

}