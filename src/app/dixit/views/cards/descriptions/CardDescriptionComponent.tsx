import './CardDescriptionComponent.scss';
import React, {useState} from "react";
import Card from "../../../models/model/Card";
import DisplayCardComponent from "../displaycard/DisplayCardComponent";
import CardDecisionComponent from "../decisons/CardDecisionComponent";
import Story from "../../../models/model/Story";

interface CardDescriptionComponentProperties {
    story?: Story
    card: Card;
    onConfirmButtonClick: (cardId: number, storyPhrase?: string) => void;
    onCancelButtonClick: () => void;
}

const StoryDescriptionComponent = ({card, onConfirmButtonClick, onCancelButtonClick}: CardDescriptionComponentProperties) => {
    const [storyPhrase, setStoryPhrase] = useState<string>('');

    const onStoryPhraseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStoryPhrase(e.target.value);
    }

    return (
        <>
            <div className="display-card-position">
                <DisplayCardComponent card={card}/>
            </div>
            <textarea className="dixit-card-description"
                      placeholder="請說出你的故事" maxLength={40} onChange={onStoryPhraseChange}>{storyPhrase}</textarea>
            <CardDecisionComponent className="dixit-card-decision"
                                   onConfirm={() => onConfirmButtonClick(card.id, storyPhrase)}
                                   onCancel={onCancelButtonClick}/>
        </>
    );
}

const PlayCardDescriptionComponent = ({story, card, onConfirmButtonClick, onCancelButtonClick}: CardDescriptionComponentProperties) => {
    return (
        <>
            <div className="display-card-position">
                <DisplayCardComponent card={card}/>
            </div>
            <span className="dixit-card-description">{`謎語: ${story?.phrase}`}</span>
            <CardDecisionComponent className="dixit-card-decision"
                                   onConfirm={() => onConfirmButtonClick(card.id)} onCancel={onCancelButtonClick}/>
        </>
    );
}

const GuessDescriptionComponent = ({card, onConfirmButtonClick, onCancelButtonClick}: CardDescriptionComponentProperties) => {
    return (
        <>
            <div className="display-card-position">
                <DisplayCardComponent card={card}/>
            </div>
            <span className="dixit-card-description">猜它？</span>
            <CardDecisionComponent className="dixit-card-decision"
                                   onConfirm={() => onConfirmButtonClick(card.id)} onCancel={onCancelButtonClick}/>
        </>
    );
}

export {StoryDescriptionComponent, PlayCardDescriptionComponent, GuessDescriptionComponent};