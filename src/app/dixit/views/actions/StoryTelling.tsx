import React, {useState} from "react";
import {StoryDescription} from "../cards/descriptions/CardDescription";
import Card from "../../models/model/Card";
import Notification from "../Notification";
import HandCards from "../cards/handcards/HandCards";
import {dixitService} from "../../models/services/services";
import {DixitContextValue, useDixitContext} from "../Dixit";
import DixitOverview from "../../models/DixitOverview";

const StoryTelling = () => {
    const {dixitId, playerId, dixitOverview}: DixitContextValue = useDixitContext();
    const {rounds, handCards, storyteller}: DixitOverview = dixitOverview;
    const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);

    const onStoryConfirm = (cardId: number, storyPhrase?: string) => {
        if (storyPhrase) {
            dixitService.tellStory(dixitId, rounds, playerId, {phrase: storyPhrase, cardId})
                .then();
        }
    }

    const onStoryCancel = () => {
        setSelectedCard(undefined);
    }

    const onHandCardClick = (handCard: Card) => {
        setSelectedCard(handCard);
    }

    if (storyteller) {
        const isStoryTeller: boolean = playerId === storyteller.id;
        return (
            <>
                {
                    selectedCard ?
                        <StoryDescription card={selectedCard}
                                          onConfirmButtonClick={onStoryConfirm}
                                          onCancelButtonClick={onStoryCancel}/>
                        : <Notification message={isStoryTeller ? `你是說書人，請開始說故事` : `${storyteller.name}正在說故事`}/>
                }
                {
                    isStoryTeller ? <HandCards handCards={handCards}
                                               onHandCardClick={onHandCardClick}/> : <></>
                }
            </>
        );
    }
    return <></>
}

export default StoryTelling;
