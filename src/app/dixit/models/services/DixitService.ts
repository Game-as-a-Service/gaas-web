import axios, {AxiosPromise} from "axios";
import {RxStomp, RxStompConfig} from "@stomp/rx-stomp";
import DixitRoundStoryTellingEvent from "../events/roundstate/DixitRoundStoryTellingEvent";
import {Subscription} from "rxjs";
import DixitRoundCardPlayingEvent from "../events/roundstate/DixitRoundCardPlayingEvent";
import DixitRoundPlayerGuessingEvent from "../events/roundstate/DixitRoundPlayerGuessingEvent";
import DixitRoundScoringEvent from "../events/roundstate/DixitRoundScoringEvent";
import DixitGameOverEvent from "../events/gamestate/DixitGameOverEvent";
import DixitRoundOverEvent from "../events/roundstate/DixitRoundOverEvent";
import DixitDuringRoundCardPlayingEvent from "../events/during/DixitDuringRoundCardPlayingEvent";
import DixitDuringRoundPlayerGuessingEvent from "../events/during/DixitDuringRoundPlayerGuessingEvent";
import DixitOverview from "../DixitOverview";
import DixitGameStartedEvent from "../events/gamestate/DixitGameStartedEvent";
import Event from "../events/Event";

export class DixitService {
    private readonly baseURL: string | undefined;
    private readonly baseBrokerURL: string | undefined;
    private readonly rxStomp: RxStomp;
    private readonly eventListener: Array<DixitEventHandler>;
    private events: Array<Event>;
    private handingEvent: boolean;

    constructor() {
        this.baseURL = process.env.REACT_APP_DIXIT_SVC_BASE_URL;
        this.baseBrokerURL = process.env.REACT_APP_DIXIT_BROKER_SVC_BASE_URL;
        this.rxStomp = new RxStomp();
        this.events = [];
        this.eventListener = [];
        this.handingEvent = false;
        this.connect();
    }

    private connect(): void {
        const config = new RxStompConfig();
        config.brokerURL = this.baseBrokerURL;
        config.reconnectDelay = 200;
        if (this.rxStomp.active) {
            this.rxStomp.deactivate()
                .then(r => r);
        }
        this.rxStomp.configure(config);
        this.rxStomp.activate();
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

    public subscribeToDixitGameStartedEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): Subscription {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/gameStates/started/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitGameStartedEvent(JSON.parse(res.body))));
    }

    public subscribeToDixitStoryTellingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): Subscription {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/story-telling/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitRoundStoryTellingEvent(JSON.parse(res.body))));
    }

    public subscribeToDixitCardPlayingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): Subscription {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/card-playing/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitRoundCardPlayingEvent(JSON.parse(res.body))));
    }

    public subscribeToDixitDuringRoundCardPlayingEvent(dixitId: string, playerId: string, subscriber: (event: DixitDuringRoundCardPlayingEvent) => void): Subscription {
        const topic: string = `/topic/dixit/${dixitId}/during/card-playing/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => subscriber(new DixitDuringRoundCardPlayingEvent(JSON.parse(res.body))));
    }

    public subscribeToDixitPlayerGuessingEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): Subscription {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/player-guessing/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitRoundPlayerGuessingEvent(JSON.parse(res.body))));
    }

    public subscribeToDixitDuringRoundPlayerGuessingEvent(dixitId: string, playerId: string, subscriber: (event: DixitDuringRoundPlayerGuessingEvent) => void): Subscription {
        const topic: string = `/topic/dixit/${dixitId}/during/player-guessing/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => subscriber(new DixitDuringRoundPlayerGuessingEvent(JSON.parse(res.body))));
    }

    public subscribeToDixitScoringEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): Subscription {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/scoring/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitRoundScoringEvent(JSON.parse(res.body))));
    }

    public subscribeToDixitRoundOverEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): Subscription {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/roundStates/over/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitRoundOverEvent(JSON.parse(res.body))));
    }

    public subscribeToDixitGameOverEvent(dixitId: string, playerId: string, dixitEventHandler: DixitEventHandler): Subscription {
        this.eventListener.push(dixitEventHandler);
        const topic: string = `/topic/dixit/${dixitId}/gameStates/over/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => this.onEvent(new DixitGameOverEvent(JSON.parse(res.body))));
    }

    private onEvent(event: Event): void {
        if (!this.handingEvent) {
            this.handingEvent = true;
            this.eventListener.forEach(l => l.handleEvent(event));
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
            this.eventListener.forEach(l => l.handleEvent(nextEvent));
        }
    }
}

export interface DixitRequest {
    readonly storyPhrase?: string
    readonly cardId: number
}

interface DixitEventHandler {
    handleEvent: (event: Event) => void;
}