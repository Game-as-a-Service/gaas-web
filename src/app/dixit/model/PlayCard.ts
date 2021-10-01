import Player from "./Player";
import Card from "./Card";

export default class PlayCard {
    constructor(public readonly player: Player,
                public readonly card: Card) {
    }

    public equals(playCard?: PlayCard): boolean {
        if (playCard) {
            return this.player.equals(playCard.player) && this.card.equals(playCard.card);
        }
        return false;
    }
}