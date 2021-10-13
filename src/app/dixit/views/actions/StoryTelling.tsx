import React, {useEffect, useState} from "react";
import {StoryDescription} from "../cards/descriptions/CardDescription";
import Card from "../../models/model/Card";
import {STORY_TELLING} from "../../models/model/RoundState";
import EventNotice from "../EventNotice";
import HandCards from "../cards/handcards/HandCards";
import {dixitService} from "../../models/services/services";
import DixitRoundStoryTellingEvent from "../../models/events/roundstate/DixitRoundStoryTellingEvent";
import {Subscription} from "rxjs";
import {DixitContextValue, useDixitContext} from "../Dixit";
import Event from "../../models/events/Event";

const StoryTelling = () => {
    const {dixitId, playerId, dixitOverview, setDixitOverview}: DixitContextValue = useDixitContext();
    const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);
    const subscriptions: Array<Subscription> = [];

    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        subscriptions.push(dixitService.subscribeToDixitStoryTellingEvent(dixitId, playerId, onDixitStoryTelling));
    }

    const onDixitStoryTelling = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitRoundStoryTellingEvent) {
                const dixitStoryTellingEvent: DixitRoundStoryTellingEvent = event as DixitRoundStoryTellingEvent;
                setDixitOverview({
                    ...dixitOverview,
                    roundState: dixitStoryTellingEvent.roundState,
                    rounds: dixitStoryTellingEvent.rounds,
                    handCards: dixitStoryTellingEvent.storyteller.handCards
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const onStoryConfirm = (cardId: number, storyPhrase?: string) => {
        if (storyPhrase) {
            dixitService.tellStory(dixitId, dixitOverview.rounds, playerId, {storyPhrase, cardId})
                .then(() => setDixitOverview({...dixitOverview, handCards: []}))
                .then(() => setSelectedCard(undefined));
        }
    }

    const onStoryCancel = () => {
        setDixitOverview({...dixitOverview, roundState: STORY_TELLING});
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
