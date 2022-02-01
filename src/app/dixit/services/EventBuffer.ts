import DixitOverview from "../models/DixitOverview";
import {CARD_PLAYING, PLAYER_GUESSING, STORY_TELLING} from "../models/model/RoundState";
import DixitRoundStoryTellingEvent from "../models/events/roundstate/DixitRoundStoryTellingEvent";
import DixitRoundCardPlayingEvent from "../models/events/roundstate/DixitRoundCardPlayingEvent";
import DixitRoundPlayerGuessingEvent from "../models/events/roundstate/DixitRoundPlayerGuessingEvent";
import DixitRoundScoringEvent from "../models/events/roundstate/DixitRoundScoringEvent";
import {generate} from "../utils/DixitUtil";
import Event from "../models/events/Event";
import DixitGameStartedEvent from "../models/events/gamestate/DixitGameStartedEvent";
import {DixitEventHandler} from "./DixitService";
import DixitGameOverEvent from "../models/events/gamestate/DixitGameOverEvent";

export class EventBuffer {

    private readonly events: Array<Event>;
    private readonly eventListener: Array<DixitEventHandler>;
    private readonly roundEventNames: Array<string>;
    private handingEvent: boolean;
    private nextRoundEventNameIndex: number;

    public constructor() {
        this.events = [];
        this.eventListener = [];
        this.roundEventNames = [];
        this.handingEvent = false;
        this.nextRoundEventNameIndex = 0;
    }

    public subscribeEvent(dixitEventHandler: DixitEventHandler): void {
        this.eventListener.push(dixitEventHandler);
    }

    public onEvent(event: Event): void {
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

    public initDixitRoundEventNames(event: Event): void {
        const eventName: string = event.constructor.name;
        if (eventName === DixitGameStartedEvent.name) {
            const dixitGameStartedEvent: DixitGameStartedEvent = event as DixitGameStartedEvent;
            this.setupDixitRoundEventNames(dixitGameStartedEvent.players.length);
        }
    }

    public setupDixitOverview({roundState, players, playCards, guesses}: DixitOverview): void {
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

    public setupDixitRoundEventNames(numberOfPlayers: number): void {
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
}