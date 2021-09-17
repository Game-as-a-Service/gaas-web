export default class Player {
    constructor(public readonly id: string,
                public name: string,
                public readonly color: string,
                public score: number = 0) {
    }

    public equals(player: Player): boolean {
        return this.id === player.id && this.name === player.name;
    }
}