import axios, {AxiosPromise} from "axios";
import {RxStomp, RxStompConfig} from "@stomp/rx-stomp";
import DixitRoundStoryTellingEvent from "../models/events/roundstate/DixitRoundStoryTellingEvent";
import {Subscription} from "rxjs";
import DixitRoundCardPlayingEvent from "../models/events/roundstate/DixitRoundCardPlayingEvent";
import DixitRoundPlayerGuessingEvent from "../models/events/roundstate/DixitRoundPlayerGuessingEvent";
import DixitRoundScoringEvent from "../models/events/roundstate/DixitRoundScoringEvent";
import DixitGameOverEvent from "../models/events/gamestate/DixitGameOverEvent";
import DixitOverview from "../models/DixitOverview";
import DixitGameStartedEvent from "../models/events/gamestate/DixitGameStartedEvent";
import Event from "../models/events/Event";
import {executeIfExist} from "../utils/DixitUtil";
import {EventBuffer} from "./EventBuffer";

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
        const topic: string = `/topic/dixit/${dixitId}/gameStates/started/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitGameStartedEvent(JSON.parse(res.body))))
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitStoryTellingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/story-telling/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundStoryTellingEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitCardPlayingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/card-playing/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundCardPlayingEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitPlayerGuessingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/player-guessing/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundPlayerGuessingEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitScoringEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/scoring/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.eventBuffer.onEvent(new DixitRoundScoringEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitGameOverEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventBuffer.subscribeEvent(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/gameStates/over/players/${playerId}`;
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