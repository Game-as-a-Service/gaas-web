export default class Card {
    constructor(public readonly id: number,
                public readonly image: string) {
    }

    public equals(card: Card): boolean {
        return this.id === card.id;
    }
}