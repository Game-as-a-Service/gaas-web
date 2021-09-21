import {StoryDescription} from "../cards/descriptions/CardDescription";
import React, {useEffect, useState} from "react";
import Card from "../model/domain/Card";
import {RoundState, STORY_TELLING} from "../model/domain/RoundState";
import EventNotice from "../EventNotice";
import HandCards from "../cards/handcards/HandCards";
import {TellStoryRequest} from "../services/DixitService";
import {dixitService} from "../services/services";
import DixitRoundStoryTellingEvent from "../model/events/DixitRoundStoryTellingEvent";
import {Subscription} from "rxjs";
import {useDixitContext} from "../Dixit";

let rounds: number = 0;
let roundStateBackup: RoundState = undefined;
const Story = () => {
    const {dixitId, playerId} = useDixitContext();
    const [roundState, setRoundState] = useState<RoundState>(roundStateBackup);
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
        rounds = dixitStoryTellingEvent.rounds;
        roundStateBackup = dixitStoryTellingEvent.roundState;
        setRoundState(roundStateBackup);
        setHandCards(dixitStoryTellingEvent.handCards);
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const onStoryConfirm = (cardId: number, storyPhrase?: string) => {
        if (storyPhrase) {
            let request: TellStoryRequest = new TellStoryRequest(storyPhrase, cardId);
            dixitService.tellStory(dixitId, rounds, playerId, request)
                .then(() => {
                    setHandCards([]);
                    setSelectedCard(undefined);
                    setRoundState(undefined);
                });
        }
    }

    const onStoryCancel = () => {
        setRoundState(roundStateBackup);
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

export default Story;
