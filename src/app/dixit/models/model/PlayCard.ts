import Player from "./Player";
import Card from "./Card";

export default class PlayCard {
    constructor(public readonly player: Player,
                public readonly card: Card) {
    }
}