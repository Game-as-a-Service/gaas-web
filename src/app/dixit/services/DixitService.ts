import axios, {AxiosPromise} from "axios";
import {RxStomp, RxStompConfig} from "@stomp/rx-stomp";
import DixitRoundStoryTellingEvent from "../model/events/DixitRoundStoryTellingEvent";
import {Subscription} from "rxjs";
import DixitGameStartedEvent from "../model/events/DixitGameStartedEvent";
import DixitRoundCardPlayingEvent from "../model/events/DixitRoundCardPlayingEvent";
import DixitRoundPlayerGuessingEvent from "../model/events/DixitRoundPlayerGuessingEvent";
import DixitRoundScoringEvent from "../model/events/DixitRoundScoringEvent";
import DixitGameOverEvent from "../model/events/DixitGameOverEvent";
import DixitRoundOverEvent from "../model/events/DixitRoundOverEvent";

class DixitService {
    private readonly baseURL: string | undefined;
    private readonly baseBrokerURL: string | undefined;
    private readonly rxStomp: RxStomp;

    constructor() {
        this.baseURL = process.env.REACT_APP_DIXIT_SVC_BASE_URL;
        this.baseBrokerURL = process.env.REACT_APP_DIXIT_BROKER_SVC_BASE_URL;
        this.rxStomp = new RxStomp();
        this.connect();
    }

    private connect(): void {
        const config = new RxStompConfig();
        config.brokerURL = this.baseBrokerURL;
        config.reconnectDelay = 200;
        if (this.rxStomp.active) {
            this.rxStomp.deactivate();
        }
        this.rxStomp.configure(config);
        this.rxStomp.activate();
    }

    public tellStory(dixitId: string, round: number, playerId: string, request: TellStoryRequest): AxiosPromise {
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

    public subscribeToDixitGameStartedEvent(dixitId: string, playerId: string, subscriber: (event: DixitGameStartedEvent) => void): Subscription {
        const topic: string = `/topic/dixit/${dixitId}/gameStates/started/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => subscriber(JSON.parse(res.body) as DixitGameStartedEvent));
    }

    public subscribeToDixitStoryTellingEvent(dixitId: string, playerId: string, subscriber: (event: DixitRoundStoryTellingEvent) => void): Subscription {
        const topic: string = `/topic/dixit/${dixitId}/roundStates/story-telling/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => subscriber(JSON.parse(res.body) as DixitRoundStoryTellingEvent));
    }

    public subscribeToDixitCardPlayingEvent(dixitId: string, playerId: string, subscriber: (event: DixitRoundCardPlayingEvent) => void): Subscription {
        const topic: string = `/topic/dixit/${dixitId}/roundStates/card-playing/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => subscriber(JSON.parse(res.body) as DixitRoundCardPlayingEvent));
    }

    public subscribeToDixitPlayerGuessingEvent(dixitId: string, playerId: string, subscriber: (event: DixitRoundPlayerGuessingEvent) => void): Subscription {
        const topic: string = `/topic/dixit/${dixitId}/roundStates/player-guessing/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => subscriber(JSON.parse(res.body) as DixitRoundPlayerGuessingEvent));
    }

    public subscribeToDixitScoringEvent(dixitId: string, playerId: string, subscriber: (event: DixitRoundScoringEvent) => void): Subscription {
        const topic: string = `/topic/dixit/${dixitId}/roundStates/scoring/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => subscriber(JSON.parse(res.body) as DixitRoundScoringEvent));
    }

    public subscribeToDixitRoundOverEvent(dixitId: string, playerId: string, subscriber: (event: DixitRoundOverEvent) => void): Subscription {
        const topic: string = `/topic/dixit/${dixitId}/roundStates/over/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => subscriber(JSON.parse(res.body) as DixitRoundOverEvent));
    }

    public subscribeToDixitGameOverEvent(dixitId: string, playerId: string, subscriber: (event: DixitGameOverEvent) => void): Subscription {
        const topic: string = `/topic/dixit/${dixitId}/gameStates/over/players/${playerId}`;
        return this.rxStomp.watch(topic)
            .subscribe(res => subscriber(JSON.parse(res.body) as DixitGameOverEvent));
    }
}

class DixitRequest {
    constructor(public readonly cardId: number) {
    }
}

class TellStoryRequest extends DixitRequest {
    constructor(public readonly phrase: string,
                public readonly cardId: number) {
        super(cardId);
    }
}

export {DixitService, DixitRequest, TellStoryRequest};