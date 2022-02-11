class Game {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly serviceHost: string) {
	}
}

class GameRoom {
	constructor(
        public readonly id: string,
        public readonly hostId: string,
		  public readonly passCode: string,
        public players: Player[]) {
	}
}

class Player {
	constructor(
        public readonly id: string,
        public readonly name: string,
        public ready: boolean,
        public readonly host: boolean = false) {
	}
}

export {Player, GameRoom, Game};
