import React, {useCallback, useEffect} from "react";
import StoryTelling from "./actions/StoryTelling";
import CardPlaying from "./actions/CardPlaying";
import PlayerGuessing from "./actions/PlayerGuessing";
import DixitScoring from "./actions/DixitScoring";
import DixitRanking from "./actions/DixitRanking";
import {DixitContextValue, useDixitContext} from "./Dixit";
import {dixitService} from "../models/services/services";
import Event from "../models/events/Event";
import DixitRoundScoringEvent from "../models/events/roundstate/DixitRoundScoringEvent";
import DixitOverview from "../models/DixitOverview";
import DixitRoundStoryTellingEvent from "../models/events/roundstate/DixitRoundStoryTellingEvent";
import DixitGameStartedEvent from "../models/events/gamestate/DixitGameStartedEvent";
import DixitRoundCardPlayingEvent from "../models/events/roundstate/DixitRoundCardPlayingEvent";
import DixitRoundPlayerGuessingEvent from "../models/events/roundstate/DixitRoundPlayerGuessingEvent";
import DixitGameOverEvent from "../models/events/gamestate/DixitGameOverEvent";
import {GAME_OVER} from "../models/model/GameState";
import {CARD_PLAYING, PLAYER_GUESSING, SCORING, STORY_TELLING} from "../models/model/RoundState";
import {delay} from "../utils/DixitUtil";
import Guess from "../models/model/Guess";

const Playground = () => {
    const {dixitId, playerId, dixitOverview, setDixitOverview}: DixitContextValue = useDixitContext();
    const {gameState, roundState, storyteller}: DixitOverview = dixitOverview;
    const delayTime: number = 1500;

    const subscribeEvents = useCallback(() => {

        const onDixitGameStarted = {
            handleEvent: (event: Event) => {
                if (event instanceof DixitGameStartedEvent) {
                    const dixitGameStartedEvent: DixitGameStartedEvent = event as DixitGameStartedEvent;
                    const {gameState, players}: DixitGameStartedEvent = dixitGameStartedEvent;
                    setDixitOverview((dixitOverview: DixitOverview) => {
                        return {...dixitOverview, gameState, players};
                    });
                    dixitService.onEventHandled(dixitGameStartedEvent);
                }
            }
        }

        const onDixitStoryTelling = {
            handleEvent: (event: Event) => {
                if (event instanceof DixitRoundStoryTellingEvent) {
                    const dixitStoryTellingEvent: DixitRoundStoryTellingEvent = event as DixitRoundStoryTellingEvent;
                    if (event.rounds === 1) {
                        onStoryTelling(dixitStoryTellingEvent);
                    } else {
                        delay(delayTime, () => onStoryTelling(dixitStoryTellingEvent));
                    }
                }
            }
        }

        const onStoryTelling = (dixitStoryTellingEvent: DixitRoundStoryTellingEvent) => {
            const {rounds, roundState, storyteller, handCards}: DixitRoundStoryTellingEvent = dixitStoryTellingEvent;
            setDixitOverview((dixitOverview: DixitOverview) => {
                return {...dixitOverview, rounds, roundState, storyteller, handCards};
            });
            dixitService.onEventHandled(dixitStoryTellingEvent);
        }

        const onDixitCardPlaying = {
            handleEvent: (event: Event) => {
                if (event instanceof DixitRoundCardPlayingEvent) {
                    const dixitRoundCardPlayingEvent: DixitRoundCardPlayingEvent = event as DixitRoundCardPlayingEvent;
                    const {
                        rounds,
                        roundState,
                        story,
                        playCards
                    }: DixitRoundCardPlayingEvent = dixitRoundCardPlayingEvent;
                    setDixitOverview((dixitOverview: DixitOverview) => {
                        return {...dixitOverview, rounds, roundState, story, playCards};
                    });
                    dixitService.onEventHandled(dixitRoundCardPlayingEvent);
                }
            }
        }

        const onDixitPlayerGuessing = {
            handleEvent: (event: Event) => {
                if (event instanceof DixitRoundPlayerGuessingEvent) {
                    const dixitPlayerGuessingEvent: DixitRoundPlayerGuessingEvent = event as DixitRoundPlayerGuessingEvent;
                    const isStoryTeller: boolean = playerId === storyteller?.id;
                    if (isStoryTeller || dixitPlayerGuessingEvent.guesses.find(({guesser}: Guess) => guesser.id === playerId)) {
                        onPlayerGuessing(dixitPlayerGuessingEvent);
                    } else {
                        delay(delayTime, () => onPlayerGuessing(dixitPlayerGuessingEvent));
                    }
                }
            }
        }

        const onPlayerGuessing = (dixitPlayerGuessingEvent: DixitRoundPlayerGuessingEvent) => {
            const {rounds, roundState, playCards, guesses}: DixitRoundPlayerGuessingEvent = dixitPlayerGuessingEvent;
            setDixitOverview((dixitOverview: DixitOverview) => {
                return {...dixitOverview, rounds, roundState, playCards, guesses};
            });
            dixitService.onEventHandled(dixitPlayerGuessingEvent);
        }

        const onDixitScoring = {
            handleEvent: (event: Event) => {
                if (event instanceof DixitRoundScoringEvent) {
                    delay(delayTime, () => onScoring(event as DixitRoundScoringEvent));
                }
            }
        }

        const onScoring = (dixitScoringEvent: DixitRoundScoringEvent) => {
            const {roundState, players}: DixitRoundScoringEvent = dixitScoringEvent;
            setDixitOverview((dixitOverview: DixitOverview) => {
                return {
                    ...dixitOverview,
                    roundState,
                    players: players.sort((playerA, playerB) => playerA.score === playerB.score ? playerA.id.localeCompare(playerB.id) : playerB.score - playerA.score)
                };
            });
            dixitService.onEventHandled(dixitScoringEvent);
        }

        const onDixitGameOver = {
            handleEvent: (event: Event) => {
                if (event instanceof DixitGameOverEvent) {
                    const dixitGameOverEvent: DixitGameOverEvent = event as DixitGameOverEvent;
                    const {gameState, winners}: DixitGameOverEvent = dixitGameOverEvent;
                    setDixitOverview((dixitOverview: DixitOverview) => {
                        return {
                            ...dixitOverview,
                            gameState,
                            winners: winners.sort((winnerA, winnerB) => winnerA.score === winnerB.score ? winnerA.id.localeCompare(winnerB.id) : winnerB.score - winnerA.score)
                        };
                    });
                    dixitService.onEventHandled(dixitGameOverEvent);
                }
            }
        }


        dixitService.subscribeToDixitGameStartedEvent(dixitId, playerId, onDixitGameStarted);
        dixitService.subscribeToDixitStoryTellingEvent(dixitId, playerId, onDixitStoryTelling);
        dixitService.subscribeToDixitCardPlayingEvent(dixitId, playerId, onDixitCardPlaying);
        dixitService.subscribeToDixitPlayerGuessingEvent(dixitId, playerId, onDixitPlayerGuessing);
        dixitService.subscribeToDixitScoringEvent(dixitId, playerId, onDixitScoring);
        dixitService.subscribeToDixitGameOverEvent(dixitId, playerId, onDixitGameOver);

    }, [dixitId, playerId, setDixitOverview, storyteller]);

    const unsubscribeEvents = useCallback(() => {
        dixitService.clearSubscriptions();
    }, []);

    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, [subscribeEvents, unsubscribeEvents]);

    if (GAME_OVER === gameState) {
        return <DixitRanking/>;
    } else if (STORY_TELLING === roundState) {
        return <StoryTelling/>;
    } else if (CARD_PLAYING === roundState) {
        return <CardPlaying/>;
    } else if (PLAYER_GUESSING === roundState) {
        return <PlayerGuessing/>;
    } else if (SCORING === roundState) {
        return <DixitScoring/>;
    } else {
        return <></>;
    }
}

export default Playground;