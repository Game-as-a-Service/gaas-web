import axios, {AxiosInstance, AxiosPromise} from "axios";
import {RxStomp, RxStompConfig} from "@stomp/rx-stomp";
import DixitRoundStoryToldEvent from "../models/events/roundstate/DixitRoundStoryToldEvent";
import {Subscription} from "rxjs";
import DixitRoundCardPlayedEvent from "../models/events/roundstate/DixitRoundCardPlayedEvent";
import DixitRoundStoryGuessedEvent from "../models/events/roundstate/DixitRoundStoryGuessedEvent";
import DixitRoundScoredEvent from "../models/events/roundstate/DixitRoundScoredEvent";
import DixitGameOverEvent from "../models/events/gamestate/DixitGameOverEvent";
import DixitOverview from "../models/DixitOverview";
import DixitGameStartedEvent from "../models/events/gamestate/DixitGameStartedEvent";
import Event from "../models/events/Event";
import {EventBuffer} from "./EventBuffer";
import {OVER, STARTED} from "../models/model/GameState";
import {CARD_PLAYING, SCORING, STORY_GUESSING, STORY_TELLING} from "../models/model/RoundState";

export class DixitService {
    private readonly axios: AxiosInstance;
    private readonly rxStomp: RxStomp;
    private readonly subscriptions: Array<Subscription>;
    private readonly eventBuffer: EventBuffer;
    public dixitConnectCallback: () => void;

    public constructor(dixitServiceHost: string) {
        this.axios = axios.create({baseURL: dixitServiceHost, timeout: 5000});
        this.rxStomp = new RxStomp();
        this.subscriptions = [];
        this.dixitConnectCallback = () => {
        };
        this.connect(dixitServiceHost);
        this.eventBuffer = new EventBuffer();
    }

    private connect(serviceHost: string): void {
        const config: RxStompConfig = new RxStompConfig();
        const dixitServiceHost: string = serviceHost.replace('http', 'ws');
        config.brokerURL = `${dixitServiceHost}/broker`;
        config.reconnectDelay = 200;
        config.connectionTimeout = 5000;
        if (this.rxStomp.active) {
            this.rxStomp.deactivate()
                .then(r => r);
        }
        this.rxStomp.configure(config);
        this.rxStomp.activate();
        this.rxStomp.connected$
            .subscribe(this.dixitConnectCallback);
    }

    public getDixitOverview(dixitId: string, playerId: string): Promise<DixitOverview> {
        return this.axios.get<DixitOverview>(`/api/dixit/${dixitId}/players/${playerId}/overview`)
            .then(res => {
                const dixitOverview: DixitOverview = new DixitOverview(res.data);
                this.eventBuffer.setupDixitOverview(dixitOverview);
                return dixitOverview;
            });
    }

    public tellStory(dixitId: string, round: number, playerId: string, request: DixitRequest): AxiosPromise {
        return this.axios.put(`/api/dixit/${dixitId}/rounds/${round}/players/${playerId}/story`, request);
    }

    public playCard(dixitId: string, round: number, playerId: string, request: DixitRequest): AxiosPromise {
        return this.axios.put(`/api/dixit/${dixitId}/rounds/${round}/players/${playerId}/playcard`, request);
    }

    public guessStory(dixitId: string, round: number, playerId: string, request: DixitRequest): AxiosPromise {
        return this.axios.put(`/api/dixit/${dixitId}/rounds/${round}/players/${playerId}/guess`, request);
    }

    public subscribeToDixitGameStartedEvent(dixitId: string, playerId: string, eventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(eventHandler);
        const topic: string = `/topic/dixit/${dixitId}/gameStates/${STARTED}/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitGameStartedEvent(JSON.parse(res.body))))
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitRoundStoryToldEvent(dixitId: string, playerId: string, eventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(eventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/${STORY_TELLING}/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundStoryToldEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitRoundCardPlayedEvent(dixitId: string, playerId: string, eventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(eventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/${CARD_PLAYING}/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundCardPlayedEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitRoundStoryGuessedEvent(dixitId: string, playerId: string, eventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(eventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/${STORY_GUESSING}/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundStoryGuessedEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitRoundScoredEvent(dixitId: string, playerId: string, eventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(eventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/${SCORING}/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundScoredEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitGameOverEvent(dixitId: string, playerId: string, eventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(eventHandler);
        const topic: string = `/topic/dixit/${dixitId}/gameStates/${OVER}/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitGameOverEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public onEventHandled(event: Event): void {
        this.eventBuffer.onEventHandled(event);
    }

    public initializeDixit(): void {
        this.eventBuffer.initializeDixit();
    }

    public clearSubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }
}

export interface DixitRequest {
    readonly phrase?: string
    readonly cardId: number
}

export interface DixitEventHandler {
    handleEvent: (event: Event) => void;
}