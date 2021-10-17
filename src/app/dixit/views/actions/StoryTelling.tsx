import React, {useEffect, useState} from "react";
import {StoryDescription} from "../cards/descriptions/CardDescription";
import Card from "../../models/model/Card";
import {STORY_TELLING} from "../../models/model/RoundState";
import EventNotice from "../EventNotice";
import HandCards from "../cards/handcards/HandCards";
import {dixitService} from "../../models/services/services";
import DixitRoundStoryTellingEvent from "../../models/events/roundstate/DixitRoundStoryTellingEvent";
import {DixitContextValue, useDixitContext} from "../Dixit";
import Event from "../../models/events/Event";
import DixitOverview from "../../models/DixitOverview";
import {delay} from "../../utils/DixitUtil";

const StoryTelling = () => {
    const {dixitId, playerId, dixitOverview, setDixitOverview}: DixitContextValue = useDixitContext();
    const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);

    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        dixitService.subscribeToDixitStoryTellingEvent(dixitId, playerId, onDixitStoryTelling);
    }

    const onDixitStoryTelling = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitRoundStoryTellingEvent) {
                if (event.rounds === 1) {
                    const dixitStoryTellingEvent: DixitRoundStoryTellingEvent = event as DixitRoundStoryTellingEvent;
                    setDixitOverview((dixitOverview: DixitOverview) => {
                        return {
                            ...dixitOverview,
                            roundState: dixitStoryTellingEvent.roundState,
                            rounds: dixitStoryTellingEvent.rounds,
                            handCards: dixitStoryTellingEvent.storyteller.handCards
                        };
                    });
                    dixitService.onEventHandled(dixitStoryTellingEvent);
                } else {
                    delay(5000, () => {
                        const dixitStoryTellingEvent: DixitRoundStoryTellingEvent = event as DixitRoundStoryTellingEvent;
                        setDixitOverview((dixitOverview: DixitOverview) => {
                            return {
                                ...dixitOverview,
                                roundState: dixitStoryTellingEvent.roundState,
                                rounds: dixitStoryTellingEvent.rounds,
                                handCards: dixitStoryTellingEvent.storyteller.handCards
                            };
                        });
                        dixitService.onEventHandled(dixitStoryTellingEvent);
                    });
                }
            }
        }
    }

    const unsubscribeEvents = () => {
        dixitService.clearSubscriptions();
    }

    const onStoryConfirm = (cardId: number, storyPhrase?: string) => {
        if (storyPhrase) {
            dixitService.tellStory(dixitId, dixitOverview.rounds, playerId, {phrase: storyPhrase, cardId})
                .then(() => {
                    setDixitOverview((dixitOverview: DixitOverview) => {
                        return {...dixitOverview, handCards: []};
                    });
                    setSelectedCard(undefined);
                });
        }
    }

    const onStoryCancel = () => {
        setDixitOverview((dixitOverview: DixitOverview) => {
            return {...dixitOverview, roundState: STORY_TELLING};
        });
        setSelectedCard(undefined);
    }

    const onHandCardClick = (e: React.MouseEvent<HTMLElement>, handCardId: number) => {
        const card: Card | undefined = dixitOverview.handCards.find(card => card.id === handCardId);
        setSelectedCard(card);
    }

    const isStoryTelling: boolean = STORY_TELLING === dixitOverview.roundState;
    if (isStoryTelling) {
        return (
            <>
                {
                    selectedCard ?
                        <StoryDescription card={selectedCard}
                                          onConfirmButtonClick={onStoryConfirm}
                                          onCancelButtonClick={onStoryCancel}/>
                        : <EventNotice dixitState={dixitOverview.roundState}/>
                }
                <HandCards dixitState={dixitOverview.roundState}
                           handCards={dixitOverview.handCards}
                           onHandCardClick={onHandCardClick}/>
            </>
        );
    }
    return <></>;
}

export default StoryTelling;
