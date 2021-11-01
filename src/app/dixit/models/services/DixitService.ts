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
import {executeIfExist, generate} from "../../utils/DixitUtil";
import {CARD_PLAYING, PLAYER_GUESSING, STORY_TELLING} from "../model/RoundState";

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
    private _dixitConnectCallback?: () => void;

    public constructor() {
        this.baseURL = process.env.REACT_APP_DIXIT_SVC_BASE_URL;
        this.baseBrokerURL = process.env.REACT_APP_DIXIT_BROKER_SVC_BASE_URL;
        this.rxStomp = new RxStomp();
        this.connect();
        this.events = [];
        this.eventListener = [];
        this.handingEvent = false;
        this.subscriptions = [];
        this.roundEventNames = [];
        this.nextRoundEventNameIndex = 0;
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
        return axios.get(url)
            .then(res => {
                const dixitOverview: DixitOverview = new DixitOverview(res.data);
                this.setupDixitRoundState(dixitOverview);
                return dixitOverview;
            });
    }

    private setupDixitRoundState({roundState, players, playCards, guesses}: DixitOverview): void {
        this.setupDixitRoundEventNames(players.length);
        let currentRoundEventNameIndex: number;
        if (STORY_TELLING === roundState) {
            currentRoundEventNameIndex = this.roundEventNames.indexOf(DixitRoundStoryTellingEvent.name);
        } else if (CARD_PLAYING === roundState) {
            currentRoundEventNameIndex = this.roundEventNames.indexOf(DixitRoundCardPlayingEvent.name) + playCards.length;
        } else if (PLAYER_GUESSING === roundState) {
            currentRoundEventNameIndex = this.roundEventNames.indexOf(DixitRoundPlayerGuessingEvent.name) + guesses.length;
        } else {
            currentRoundEventNameIndex = this.roundEventNames.indexOf(DixitRoundScoringEvent.name);
        }
        this.nextRoundEventNameIndex = currentRoundEventNameIndex + 1 === this.roundEventNames.length ? 0 : currentRoundEventNameIndex + 1;
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

    public subscribeToDixitPlayerGuessingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): void {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/player-guessing/players/${playerId}`;
        const subscription: Subscription = this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitRoundPlayerGuessingEvent(JSON.parse(res.body))));
        this.subscriptions.push(subscription);
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

    private executeEvent(event: Event): void {
        const eventName: string = event.constructor.name;
        const nextRoundEventName: string = this.roundEventNames[this.nextRoundEventNameIndex];
        if (eventName === nextRoundEventName) {
            this.nextRoundEventNameIndex = this.nextRoundEventNameIndex + 1 === this.roundEventNames.length ? 0 : this.nextRoundEventNameIndex + 1;
            this.eventListener.forEach(l => l.handleEvent(event));
        } else {
            this.handingEvent = false;
            this.events.push(event);
        }
        if (eventName === DixitGameStartedEvent.name ||
            eventName === DixitGameOverEvent.name) {
            this.initDixitRoundEventNames(event);
            this.eventListener.forEach(l => l.handleEvent(event));
        }
    }

    private initDixitRoundEventNames(event: Event): void {
        const eventName: string = event.constructor.name;
        if (eventName === DixitGameStartedEvent.name) {
            const dixitGameStartedEvent: DixitGameStartedEvent = event as DixitGameStartedEvent;
            this.setupDixitRoundEventNames(dixitGameStartedEvent.players.length);
        }
    }

    private setupDixitRoundEventNames(numberOfPlayers: number): void {
        if (this.roundEventNames.length === 0) {
            this.roundEventNames.push(DixitRoundStoryTellingEvent.name);
            generate(DixitRoundCardPlayingEvent.name, numberOfPlayers).forEach(eventName => this.roundEventNames.push(eventName));
            generate(DixitRoundPlayerGuessingEvent.name, numberOfPlayers).forEach(eventName => this.roundEventNames.push(eventName));
            this.roundEventNames.push(DixitRoundScoringEvent.name);
        }
    }

    public initializeDixit(): void {
        this.events.splice(0, this.events.length);
        this.handingEvent = false;
        this.nextRoundEventNameIndex = 0;
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