class GameRoom {
    constructor(
        public readonly id: string,
        public readonly hostId: string,
        public readonly passCode: string,
        public readonly game: Game,
        // public readonly state: RoomState,
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

// const OPEN: RoomState = 'OPEN';
// const STARTED: RoomState = 'STARTED';
// const LAUNCHED: RoomState = 'LAUNCHED';
//
// type States = 'OPEN' | 'STARTED' | 'LAUNCHED';
// type RoomState = undefined | States;
//
// export type {RoomState};
// export {OPEN, STARTED, LAUNCHED};

class Player {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public ready: boolean,
        public readonly host: boolean = false) {
    }
}

export {Player, GameRoom, Game};
