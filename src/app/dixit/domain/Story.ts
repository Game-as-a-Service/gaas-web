import PlayCard from "./PlayCard";
import Card from "./Card";
import Player from "./Player";

export default class Story {
    constructor(public readonly phrase: string,
                public readonly playCard: PlayCard) {
    }

    public get storyteller(): Player {
        return this.playCard.player;
    }

    public get card(): Card {
        return this.playCard.card;
    }

}