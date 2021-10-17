import axios, {AxiosPromise} from "axios";
import {RxStomp, RxStompConfig} from "@stomp/rx-stomp";
import DixitRoundStoryTellingEvent from "../events/roundstate/DixitRoundStoryTellingEvent";
import {Subscription} from "rxjs";
import DixitRoundCardPlayingEvent from "../events/roundstate/DixitRoundCardPlayingEvent";
import DixitRoundPlayerGuessingEvent from "../events/roundstate/DixitRoundPlayerGuessingEvent";
import DixitRoundScoringEvent from "../events/roundstate/DixitRoundScoringEvent";
import DixitGameOverEvent from "../events/gamestate/DixitGameOverEvent";
import DixitOverview from "../DixitOverview";
import DixitGameStartedEvent from "../events/gamestate/DixitGameStartedEvent";
import Event from "../events/Event";

export class DixitService {
    private readonly baseURL: string | undefined;
    private readonly baseBrokerURL: string | undefined;
    private readonly rxStomp: RxStomp;
    private readonly subscriptions: Array<Subscription>;
    private readonly eventListener: Array<DixitEventHandler>;
    private readonly events: Array<Event>;
    private handingEvent: boolean;
    private readonly roundEventNames: Array<string>;
    private nextRoundEventNameIndex: number;

    public constructor() {
        this.baseURL = process.env.REACT_APP_DIXIT_SVC_BASE_URL;
        this.baseBrokerURL = process.env.REACT_APP_DIXIT_BROKER_SVC_BASE_URL;
        this.rxStomp = new RxStomp();
        this.events = [];
        this.eventListener = [];
        this.handingEvent = false;
        this.subscriptions = [];
        this.roundEventNames = [];
        this.nextRoundEventNameIndex = 0;
        this.setupEventNames();
        this.connect();
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
    }

    private setupEventNames() {
        if (this.roundEventNames.length === 0) {
            this.roundEventNames.push(DixitRoundStoryTellingEvent.name);
            this.roundEventNames.push(DixitRoundCardPlayingEvent.name);
            // this.roundEventNames.push(DixitDuringRoundCardPlayingEvent.name);
            this.roundEventNames.push(DixitRoundPlayerGuessingEvent.name);
            // this.roundEventNames.push(DixitDuringRoundPlayerGuessingEvent.name);
            this.roundEventNames.push(DixitRoundScoringEvent.name);
        }
    }

    public getDixitOverview(dixitId: string, playerId: string): Promise<DixitOverview> {
        const url: string = `${this.baseURL}/api/dixit/${dixitId}/players/${playerId}/overview`;
        return axios.get(url)
            .then(res => new DixitOverview(res.data));
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
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/gameStates/started/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitGameStartedEvent(JSON.parse(res.body))))
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitStoryTellingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/story-telling/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitRoundStoryTellingEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitCardPlayingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/card-playing/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitRoundCardPlayingEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitDuringRoundCardPlayingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        // this.eventListener.push(dixitEventHandler);
        // const topic: string = `/topic/dixit/${dixitId}/during/card-playing/players/${playerId}`;
        // const subscription: Subscription = this.rxStomp.watch(topic)
        //     .subscribe(res => this.onEvent(new DixitDuringRoundCardPlayingEvent(JSON.parse(res.body))));
        // this.subscriptions.push(subscription);
    }

    public subscribeToDixitPlayerGuessingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/player-guessing/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitRoundPlayerGuessingEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitDuringRoundPlayerGuessingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        // this.eventListener.push(dixitEventHandler);
        // const topic: string = `/topic/dixit/${dixitId}/during/player-guessing/players/${playerId}`;
        // const subscription: Subscription = this.rxStomp.watch(topic)
        //     .subscribe(res => this.onEvent(new DixitDuringRoundPlayerGuessingEvent(JSON.parse(res.body))));
        // this.subscriptions.push(subscription);
    }

    public subscribeToDixitScoringEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/scoring/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitRoundScoringEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    public subscribeToDixitGameOverEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/gameStates/over/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitGameOverEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
    }

    private onEvent(event: Event): void {
        if (!this.handingEvent) {
            this.handingEvent = true;
            this.executeEvent(event);
        } else {
            this.events.push(event);
        }
    }

    public onEventHandled(event: Event): void {
        console.log(`onEventHandled:(${event.rounds}) ${event.constructor.name}`);
        const eventIndex = this.events.indexOf(event);
        if (eventIndex !== -1) {
            this.events.splice(eventIndex, 1);
        }
        if (this.events.length === 0) {
            this.handingEvent = false;
        } else {
            const nextEvent = this.events.shift() as Event;
            this.executeEvent(nextEvent);
        }
    }

    private executeEvent(event: Event) {
        const eventName: string = event.constructor.name;
        const nextRoundEventName: string = this.roundEventNames[this.nextRoundEventNameIndex];
        if (eventName === nextRoundEventName) {
            console.log(`onHandleEvent:(${event.rounds}) ${eventName}`);
            this.nextRoundEventNameIndex = this.nextRoundEventNameIndex + 1 === this.roundEventNames.length ? 0 : this.nextRoundEventNameIndex + 1;
            this.eventListener.forEach(l => l.handleEvent(event));
        } else {
            this.handingEvent = false;
            this.events.push(event);
        }
        if (eventName === DixitGameStartedEvent.name ||
            eventName === DixitGameOverEvent.name) {
            console.log(`onHandleEvent:(${event.rounds}) ${eventName}`);
            this.eventListener.forEach(l => l.handleEvent(event));
        }
    }

    public initializeDixit(): void {
        this.events.splice(0, this.events.length);
        this.handingEvent = false;
        this.nextRoundEventNameIndex = 0;
    }

    public clearSubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
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