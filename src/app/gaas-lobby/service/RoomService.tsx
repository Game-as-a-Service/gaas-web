/* eslint-disable indent */
import axios, {AxiosInstance} from 'axios';
import {GameRoom} from "../model/model";
import {RxStomp, RxStompConfig} from "@stomp/rx-stomp";
import {Subscription} from "rxjs";
import {GameStartedEvent, RoomPlayerJoinedEvent, RoomPlayerLeftEvent, RoomPlayerReadiedEvent} from "../model/events";

interface JoinRoomResponse {
    room: GameRoom,
    playerId: string
}

interface StartingGameResponse {
    gameId: string,
    gameName: string,
    gameServiceHost: string
}

class RoomService {

    private readonly axios: AxiosInstance;
    private readonly rxStomp: RxStomp;
    private readonly subscriptions: Array<Subscription>;

    public constructor() {
        const lobbyServiceHost = process.env.REACT_APP_LOBBY_SVC_BASE_URL as string;
        this.axios = axios.create({baseURL: lobbyServiceHost, timeout: 1000});
        this.rxStomp = new RxStomp();
        this.subscriptions = [];
        this.connect(lobbyServiceHost.substr(4, lobbyServiceHost.length));
    }

    private connect(serviceHost: string): void {
        const config: RxStompConfig = new RxStompConfig();
        const lobbyServiceHost: string = serviceHost.startsWith(':') ? `ws${serviceHost}` : `w${serviceHost}`;
        config.brokerURL = `${lobbyServiceHost}/broker`;
        config.reconnectDelay = 200;
        if (this.rxStomp.active) {
            this.rxStomp.deactivate()
                .then(r => r);
        }
        this.rxStomp.configure(config);
        this.rxStomp.activate();
        // this.rxStomp.connected$
        //     .subscribe(() => executeIfExist(this._dixitConnectCallback));
    }

    async createRoom(nickName: string) {
        return this.axios.post<JoinRoomResponse>('/api/rooms', {hostName: nickName})
            .then(res => res.data);
    }

    async joinRoom(passCode: string, nickName: string) {
        return this.axios.post<JoinRoomResponse>(`/api/rooms/${passCode}/players`, {passCode, playerName: nickName})
            .then(res => res.data);
    }

    async getRoom(roomId: string) {
        return this.axios.get<GameRoom>(`/api/rooms/${roomId}`)
            .then(res => res.data);
    }

    async leaveRoom(roomId: string, playerId: string) {
        return this.axios.delete(`/api/rooms/${roomId}/players/${playerId}`);
    }

    async ready(roomId: string, playerId: string, ready: boolean) {
        return this.axios.patch(`/api/rooms/${roomId}/players/${playerId}`, {playerId, ready});
    }

    async startGame(roomId: string, playerId: string, options: Array<Option>) {
        return this.axios.post<StartingGameResponse>(`/api/rooms/${roomId}/game`, {playerId, roomId, options})
            .then(res => res.data);
    }

    public subscribeToRoomPlayerJoinedEvent(roomId: string, eventHandler: LobbyEventHandler<RoomPlayerJoinedEvent>): void {
        const topic: string = `/topic/rooms/${roomId}/joined`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => eventHandler.handleEvent(new RoomPlayerJoinedEvent(JSON.parse(res.body))))
        this.subscriptions.push(subscription);
    }

    public subscribeToRoomPlayerLeftEvent(roomId: string, eventHandler: LobbyEventHandler<RoomPlayerLeftEvent>): void {
        const topic: string = `/topic/rooms/${roomId}/left`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => eventHandler.handleEvent(new RoomPlayerLeftEvent(JSON.parse(res.body))))
        this.subscriptions.push(subscription);
    }

    public subscribeToRoomPlayerReadiedEvent(roomId: string, eventHandler: LobbyEventHandler<RoomPlayerReadiedEvent>): void {
        const topic: string = `/topic/rooms/${roomId}/readied`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => eventHandler.handleEvent(new RoomPlayerReadiedEvent(JSON.parse(res.body))))
        this.subscriptions.push(subscription);
    }

    public subscribeToGameStartedEvent(roomId: string, eventHandler: LobbyEventHandler<GameStartedEvent>): void {
        const topic: string = `/topic/rooms/${roomId}/games/started`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => eventHandler.handleEvent(new GameStartedEvent(JSON.parse(res.body))))
        this.subscriptions.push(subscription);
    }

    public clearSubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }
}

const roomService = new RoomService();

export interface LobbyEventHandler<T> {
    handleEvent: (event: T) => void;
}

class Option {
    constructor(private readonly name: string,
                private readonly value: number) {
    }
}

export {roomService, Option};
