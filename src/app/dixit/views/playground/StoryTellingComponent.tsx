import React, {useState} from "react";
import {StoryDescriptionComponent} from "../cards/descriptions/CardDescriptionComponent";
import Card from "../../models/model/Card";
import NotificationComponent from "../NotificationComponent";
import HandCardsComponent from "../cards/handcards/HandCardsComponent";
import {DixitContextValue, useDixitContext} from "../DixitComponent";
import DixitOverview from "../../models/DixitOverview";
import './StoryTellingComponent.scss';
import {DixitService} from "../../services/DixitService";

const StoryTellingComponent = ({dixitService}: { dixitService: DixitService }) => {
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
            <div className="storytelling-component-position">
                {
                    selectedCard ?
                        <div className="description-position">
                            <StoryDescriptionComponent card={selectedCard}
                                                       onConfirmButtonClick={onStoryConfirm}
                                                       onCancelButtonClick={onStoryCancel}/>
                        </div>
                        : <div className="notification-position">
                            <NotificationComponent message={isStoryTeller ? `你是說書人，請開始說故事` : `${storyteller.name}正在說故事`}/>
                        </div>
                }
                <div className="handCards-position">
                    {
                        isStoryTeller ? <HandCardsComponent handCards={handCards}
                                                            onHandCardClick={onHandCardClick}/> : <></>
                    }
                </div>
            </div>
        );
    }
    return <></>
}

export default StoryTellingComponent;
