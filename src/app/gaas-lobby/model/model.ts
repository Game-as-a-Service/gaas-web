class Game {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly domain: string) {
	}
}

class GameRoom {
	constructor(
        public readonly roomId: string,
        public readonly hostId: string,
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