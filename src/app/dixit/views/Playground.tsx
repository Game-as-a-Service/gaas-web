import React, {useCallback, useEffect} from "react";
import DixitStoryTelling from "./actions/StoryTelling";
import DixitCardPlaying from "./actions/CardPlaying";
import DixitStoryGuessing from "./actions/PlayerGuessing";
import DixitScoring from "./actions/DixitScoring";
import DixitRanking from "./actions/DixitRanking";
import {DixitContextValue, useDixitContext} from "./Dixit";
import {dixitService} from "../services/services";
import Event from "../models/events/Event";
import DixitRoundScoredEvent from "../models/events/roundstate/DixitRoundScoredEvent";
import DixitOverview from "../models/DixitOverview";
import DixitRoundStoryToldEvent from "../models/events/roundstate/DixitRoundStoryToldEvent";
import DixitGameStartedEvent from "../models/events/gamestate/DixitGameStartedEvent";
import DixitRoundCardPlayedEvent from "../models/events/roundstate/DixitRoundCardPlayedEvent";
import DixitRoundStoryGuessedEvent from "../models/events/roundstate/DixitRoundStoryGuessedEvent";
import DixitGameOverEvent from "../models/events/gamestate/DixitGameOverEvent";
import {OVER} from "../models/model/GameState";
import {CARD_PLAYING, SCORING, STORY_GUESSING, STORY_TELLING} from "../models/model/RoundState";
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
                    const gameStartedEvent: DixitGameStartedEvent = event as DixitGameStartedEvent;
                    const {gameState, players}: DixitGameStartedEvent = gameStartedEvent;
                    setDixitOverview((dixitOverview: DixitOverview) => {
                        return {...dixitOverview, gameState, players};
                    });
                    dixitService.onEventHandled(gameStartedEvent);
                }
            }
        }

        const onDixitStoryTold = {
            handleEvent: (event: Event) => {
                if (event instanceof DixitRoundStoryToldEvent) {
                    const storyToldEvent: DixitRoundStoryToldEvent = event as DixitRoundStoryToldEvent;
                    if (event.rounds === 1) {
                        onStoryTold(storyToldEvent);
                    } else {
                        delay(delayTime, () => onStoryTold(storyToldEvent));
                    }
                }
            }
        }

        const onStoryTold = (storyToldEvent: DixitRoundStoryToldEvent) => {
            const {rounds, roundState, storyteller, handCards}: DixitRoundStoryToldEvent = storyToldEvent;
            setDixitOverview((dixitOverview: DixitOverview) => {
                return {...dixitOverview, rounds, roundState, storyteller, handCards};
            });
            dixitService.onEventHandled(storyToldEvent);
        }

        const onDixitCardPlayed = {
            handleEvent: (event: Event) => {
                if (event instanceof DixitRoundCardPlayedEvent) {
                    const cardPlayedEvent: DixitRoundCardPlayedEvent = event as DixitRoundCardPlayedEvent;
                    const {rounds, roundState, story, playCards}: DixitRoundCardPlayedEvent = cardPlayedEvent;
                    setDixitOverview((dixitOverview: DixitOverview) => {
                        return {...dixitOverview, rounds, roundState, story, playCards};
                    });
                    dixitService.onEventHandled(cardPlayedEvent);
                }
            }
        }

        const onDixitStoryGuessed = {
            handleEvent: (event: Event) => {
                if (event instanceof DixitRoundStoryGuessedEvent) {
                    const storyGuessedEvent: DixitRoundStoryGuessedEvent = event as DixitRoundStoryGuessedEvent;
                    const isStoryTeller: boolean = playerId === storyteller?.id;
                    if (isStoryTeller || storyGuessedEvent.guesses.find(({guesser}: Guess) => guesser.id === playerId)) {
                        onStoryGuessed(storyGuessedEvent);
                    } else {
                        delay(delayTime, () => onStoryGuessed(storyGuessedEvent));
                    }
                }
            }
        }

        const onStoryGuessed = (storyGuessedEvent: DixitRoundStoryGuessedEvent) => {
            const {rounds, roundState, playCards, guesses}: DixitRoundStoryGuessedEvent = storyGuessedEvent;
            setDixitOverview((dixitOverview: DixitOverview) => {
                return {...dixitOverview, rounds, roundState, playCards, guesses};
            });
            dixitService.onEventHandled(storyGuessedEvent);
        }

        const onDixitScored = {
            handleEvent: (event: Event) => {
                if (event instanceof DixitRoundScoredEvent) {
                    delay(delayTime, () => onScored(event as DixitRoundScoredEvent));
                }
            }
        }

        const onScored = (scoredEvent: DixitRoundScoredEvent) => {
            const {roundState, players}: DixitRoundScoredEvent = scoredEvent;
            setDixitOverview((dixitOverview: DixitOverview) => {
                return {
                    ...dixitOverview,
                    roundState,
                    players: players.sort((playerA, playerB) => playerA.score === playerB.score ? playerA.id.localeCompare(playerB.id) : playerB.score - playerA.score)
                };
            });
            dixitService.onEventHandled(scoredEvent);
        }

        const onDixitGameOver = {
            handleEvent: (event: Event) => {
                if (event instanceof DixitGameOverEvent) {
                    const gameOverEvent: DixitGameOverEvent = event as DixitGameOverEvent;
                    const {gameState, winners}: DixitGameOverEvent = gameOverEvent;
                    setDixitOverview((dixitOverview: DixitOverview) => {
                        return {
                            ...dixitOverview,
                            gameState,
                            winners: winners.sort((winnerA, winnerB) => winnerA.score === winnerB.score ? winnerA.id.localeCompare(winnerB.id) : winnerB.score - winnerA.score)
                        };
                    });
                    dixitService.onEventHandled(gameOverEvent);
                }
            }
        }

        dixitService.subscribeToDixitGameStartedEvent(dixitId, playerId, onDixitGameStarted);
        dixitService.subscribeToDixitRoundStoryToldEvent(dixitId, playerId, onDixitStoryTold);
        dixitService.subscribeToDixitRoundCardPlayedEvent(dixitId, playerId, onDixitCardPlayed);
        dixitService.subscribeToDixitRoundStoryGuessedEvent(dixitId, playerId, onDixitStoryGuessed);
        dixitService.subscribeToDixitRoundScoredEvent(dixitId, playerId, onDixitScored);
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

    if (OVER === gameState) {
        return <DixitRanking/>;
    } else if (STORY_TELLING === roundState) {
        return <DixitStoryTelling/>;
    } else if (CARD_PLAYING === roundState) {
        return <DixitCardPlaying/>;
    } else if (STORY_GUESSING === roundState) {
        return <DixitStoryGuessing/>;
    } else if (SCORING === roundState) {
        return <DixitScoring/>;
    } else {
        return <></>;
    }
}

export default Playground;