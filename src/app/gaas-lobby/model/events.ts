import {Player} from "./model";

class RoomPlayerJoinedEvent {
    public readonly player: Player;
    public readonly roomId: string;

    constructor({player, roomId}: { player: Player, roomId: string }) {
        this.player = player;
        this.roomId = roomId;
    }
}

class RoomPlayerReadiedEvent {
    public readonly player: Player;
    public readonly roomId: string;

    constructor({player, roomId}: { player: Player, roomId: string }) {
        this.player = player;
        this.roomId = roomId;
    }
}

class RoomPlayerLeftEvent {
    public readonly player: Player;
    public readonly roomId: string;

    constructor({player, roomId}: { player: Player, roomId: string }) {
        this.player = player;
        this.roomId = roomId;
    }
}

class GameStartedEvent {
    public readonly gameId: string;
    public readonly gameName: string;
    public readonly gameServiceHost: string;

    constructor({gameId, gameName, gameServiceHost}: { gameId: string, gameName: string, gameServiceHost: string }) {
        this.gameId = gameId;
        this.gameName = gameName;
        this.gameServiceHost = gameServiceHost;
    }
}

export {RoomPlayerJoinedEvent, RoomPlayerLeftEvent, RoomPlayerReadiedEvent, GameStartedEvent};