import axios, {AxiosPromise} from "axios";
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
import {executeIfExist} from "../utils/DixitUtils";
import {EventBuffer} from "./EventBuffer";
import {OVER, STARTED} from "../models/model/GameState";
import {CARD_PLAYING, SCORING, STORY_GUESSING, STORY_TELLING} from "../models/model/RoundState";

export class DixitService {
    private readonly baseURL: string | undefined;
    private readonly baseBrokerURL: string | undefined;
    private readonly rxStomp: RxStomp;
    private readonly subscriptions: Array<Subscription>;
    private readonly eventBuffer: EventBuffer;
    private _dixitConnectCallback?: () => void;

    public constructor() {
        this.baseURL = process.env.REACT_APP_DIXIT_SVC_BASE_URL;
        this.baseBrokerURL = process.env.REACT_APP_DIXIT_BROKER_SVC_BASE_URL;
        this.rxStomp = new RxStomp();
        this.connect();
        this.subscriptions = [];
        this.eventBuffer = new EventBuffer();
    }

    private connect(): void {
        const config: RxStompConfig = new RxStompConfig();
        config.brokerURL = this.baseBrokerURL;
        config.reconnectDelay = 200;
        if (this.rxStomp.active) {
            this.rxStomp.deactivate()
                .then(r => r);
        }
        this.rxStomp.configure(config);
        this.rxStomp.activate();
        this.rxStomp.connected$
            .subscribe(() => executeIfExist(this._dixitConnectCallback));
    }

    public set dixitConnectCallback(dixitConnectCallback: () => void) {
        this._dixitConnectCallback = dixitConnectCallback;
    }

    public getDixitOverview(dixitId: string, playerId: string): Promise<DixitOverview> {
        const url: string = `${this.baseURL}/api/dixit/${dixitId}/players/${playerId}/overview`;
        return axios.get<DixitOverview>(url)
            .then(res => {
                const dixitOverview: DixitOverview = new DixitOverview(res.data);
                this.eventBuffer.setupDixitOverview(dixitOverview);
                return dixitOverview;
            });
    }

    public tellStory(dixitId: string, round: number, playerId: string, request: DixitRequest): AxiosPromise {
        const url: string = `${this.baseURL}/api/dixit/${dixitId}/rounds/${round}/players/${playerId}/story`;
        return axios.put(url, request);
    }

    public playCard(dixitId: string, round: number, playerId: string, request: DixitRequest): AxiosPromise {
        const url: string = `${this.baseURL}/api/dixit/${dixitId}/rounds/${round}/players/${playerId}/playcard`;
        return axios.put(url, request);
    }

    public guessStory(dixitId: string, round: number, playerId: string, request: DixitRequest): AxiosPromise {
        const url: string = `${this.baseURL}/api/dixit/${dixitId}/rounds/${round}/players/${playerId}/guess`;
        return axios.put(url, request);
    }

    public subscribeToDixitGameStartedEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/gameStates/${STARTED}/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitGameStartedEvent(JSON.parse(res.body))))
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitRoundStoryToldEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/${STORY_TELLING}/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundStoryToldEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitRoundCardPlayedEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/${CARD_PLAYING}/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundCardPlayedEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitRoundStoryGuessedEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/${STORY_GUESSING}/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundStoryGuessedEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitRoundScoredEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/${SCORING}/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundScoredEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitGameOverEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(dixitEventHandler);
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