/* eslint-disable indent */
import axios from 'axios';
import {Player, Game, GameRoom} from "../model/model";

interface JoinRoomResponse {
    room: GameRoom,
    playerId: string
}

class RoomService {
    private readonly axios = axios.create({
        baseURL: 'http://localhost:8080/api', timeout: 1000
    });

    async createRoom(nickName: string) {
        return this.axios.post<JoinRoomResponse>('/rooms', { hostName: nickName }).then(res => res.data);
    }

    async joinRoom(passCode: string, nickName: string) {
        return this.axios.post<JoinRoomResponse>(`/rooms/${passCode}/players`, {
            passCode,
            playerName: nickName
        })
            .then(res => res.data);
    }

    async getRoom(roomId: string) {
        return this.axios.get<GameRoom>(`/rooms/${roomId}`)
            .then(res => res.data);
    }

    async ready(roomId: string, player: Player) {
        return this.axios.patch(`/rooms/${roomId}/players/${player.id}`, {playerId: player.id, ready: player.ready});
    }

    async startGame(roomId: string, hostId: string, gameId: string) {
        return this.axios.post<Game>(`/rooms/${roomId}/game`, {playerId: hostId, gameId})
            .then(res => res.data);
    }
}

const roomService = new RoomService();

export default roomService;
