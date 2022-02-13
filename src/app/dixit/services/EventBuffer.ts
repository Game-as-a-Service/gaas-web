import DixitOverview from "../models/DixitOverview";
import {CARD_PLAYING, STORY_GUESSING, STORY_TELLING} from "../models/model/RoundState";
import DixitRoundStoryToldEvent from "../models/events/roundstate/DixitRoundStoryToldEvent";
import DixitRoundCardPlayedEvent from "../models/events/roundstate/DixitRoundCardPlayedEvent";
import DixitRoundStoryGuessedEvent from "../models/events/roundstate/DixitRoundStoryGuessedEvent";
import DixitRoundScoredEvent from "../models/events/roundstate/DixitRoundScoredEvent";
import {generate} from "../utils/DixitUtils";
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
            currentRoundEventNameIndex = this.roundEventNames.indexOf(DixitRoundStoryToldEvent.name);
        } else if (CARD_PLAYING === roundState) {
            currentRoundEventNameIndex = this.roundEventNames.indexOf(DixitRoundCardPlayedEvent.name) + playCards.length;
        } else if (STORY_GUESSING === roundState) {
            currentRoundEventNameIndex = this.roundEventNames.indexOf(DixitRoundStoryGuessedEvent.name) + guesses.length;
        } else {
            currentRoundEventNameIndex = this.roundEventNames.indexOf(DixitRoundScoredEvent.name);
        }
        this.nextRoundEventNameIndex = currentRoundEventNameIndex + 1 === this.roundEventNames.length ? 0 : currentRoundEventNameIndex + 1;
    }

    public setupDixitRoundEventNames(numberOfPlayers: number): void {
        if (this.roundEventNames.length === 0) {
            this.roundEventNames.push(DixitRoundStoryToldEvent.name);
            generate(DixitRoundCardPlayedEvent.name, numberOfPlayers).forEach(eventName => this.roundEventNames.push(eventName));
            generate(DixitRoundStoryGuessedEvent.name, numberOfPlayers).forEach(eventName => this.roundEventNames.push(eventName));
            this.roundEventNames.push(DixitRoundScoredEvent.name);
        }
    }

    public initializeDixit(): void {
        this.events.splice(0, this.events.length);
        this.handingEvent = false;
        this.nextRoundEventNameIndex = 0;
    }
}