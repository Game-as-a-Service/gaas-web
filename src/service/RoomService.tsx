/* eslint-disable indent */
import axios from 'axios';
import {Player, Game, GameRoom} from "../app/gaas-lobby/model/model";

class RoomService {
    readonly axios = axios.create({
        baseURL: 'http://localhost:8080/api', timeout: 1000
    });

    async createRoom(passCode: string, nickName: string) {
        return this.axios.post<{ roomId: string, hostId: string, passCode: string }>('/room', {
            passCode,
            hostName: nickName
        }).then(res => res.data);
    }

    async joinRoom(passCode: string, nickName: string) {
        return this.axios.post<{ roomId: string, playerId: string }>(`/room/${passCode}/player`, {
            passCode,
            playerName: nickName
        })
            .then(res => res.data);
    }

    async getRoom(roomId: string) {
        return this.axios.get<GameRoom>(`/room/${roomId}`)
            .then(res => res.data);
    }

    async ready(roomId: string, player: Player) {
        return this.axios.patch(`/room/${roomId}/player/${player.id}`, {playerId: player.id, ready: player.ready});
    }

    async startGame(roomId: string, hostId: string | null, gameId: string) {
        return this.axios.post<Game>(`/room/${roomId}/game`, {playerId: hostId, gameId})
            .then(res => res.data);
    }
}

const roomService = new RoomService();

export default roomService;
