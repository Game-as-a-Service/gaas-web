class GameRoom {
    constructor(
        public readonly id: string,
        public readonly hostId: string,
        public readonly passCode: string,
        public readonly game: Game,
        public players: Player[]) {
    }
}

class Game {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly serviceHost: string) {
    }
}

class Player {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public ready: boolean,
        public host: boolean = false) {
    }
}

export {Player, GameRoom, Game};
