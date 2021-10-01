import React, {useEffect, useState} from "react";
import {StoryDescription} from "../cards/descriptions/CardDescription";
import Card from "../model/Card";
import {RoundState, STORY_TELLING} from "../model/RoundState";
import EventNotice from "../EventNotice";
import HandCards from "../cards/handcards/HandCards";
import {TellStoryRequest} from "../services/DixitService";
import {dixitService} from "../services/services";
import DixitRoundStoryTellingEvent from "../events/roundstate/DixitRoundStoryTellingEvent";
import {Subscription} from "rxjs";
import {useDixitContext} from "../Dixit";
import {DixitContextProp} from "../DixitContext";

const StoryTelling = () => {
    const [rounds, setRounds] = useState<number>(0);
    const {dixitId, playerId}: DixitContextProp = useDixitContext();
    const [roundState, setRoundState] = useState<RoundState>(undefined);
    const [handCards, setHandCards] = useState<Card[]>([]);
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

    const onDixitStoryTelling = (dixitStoryTellingEvent: DixitRoundStoryTellingEvent) => {
        setRounds(dixitStoryTellingEvent.rounds);
        setRoundState(dixitStoryTellingEvent.roundState);
        setHandCards(dixitStoryTellingEvent.storyteller.handCards);
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const onStoryConfirm = (cardId: number, storyPhrase?: string) => {
        if (storyPhrase) {
            dixitService.tellStory(dixitId, rounds, playerId, new TellStoryRequest(storyPhrase, cardId))
                .then(() => setHandCards([]))
                .then(() => setSelectedCard(undefined))
                .then(() => setRoundState(undefined));
        }
    }

    const onStoryCancel = () => {
        setRoundState(STORY_TELLING);
        setSelectedCard(undefined);
    }

    const onHandCardClick = (e: React.MouseEvent<HTMLElement>, handCardId: number) => {
        const card: Card | undefined = handCards?.find(card => card.id === handCardId);
        setSelectedCard(card);
    }

    const isStoryTelling: boolean = STORY_TELLING === roundState;
    if (isStoryTelling) {
        return <>
            {
                selectedCard ?
                    <StoryDescription card={selectedCard}
                                      onConfirmButtonClick={onStoryConfirm}
                                      onCancelButtonClick={onStoryCancel}/>
                    : <EventNotice dixitState={roundState}/>
            }
            <HandCards dixitState={roundState} handCards={handCards} onHandCardClick={onHandCardClick}/>
        </>
    }
    return <></>
}

export default StoryTelling;
