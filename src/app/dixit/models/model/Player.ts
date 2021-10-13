import {Color} from "./Color";
import Card from "./Card";

export default class Player {
    constructor(public readonly id: string,
                public name: string,
                public readonly color: Color,
                public handCards: Array<Card>,
                public score: number = 0) {
    }
}