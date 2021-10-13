export default class Event {
    constructor(public readonly gameId: string,
                public readonly rounds: number,
                public readonly playerId: string) {
    }
}