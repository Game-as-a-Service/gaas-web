import './CardDescription.scss';
import React, {useState} from "react";
import Card from "../../model/Card";
import DisplayCard from "../../displaycard/DisplayCard";
import CardDecision from "../decisons/CardDecision";

interface CardDescriptionProp {
    card: Card;
    onConfirmButtonClick: (cardId: number, storyPhrase?: string) => void;
    onCancelButtonClick: () => void;
}

const StoryDescription = ({card, onConfirmButtonClick, onCancelButtonClick}: CardDescriptionProp) => {
    const [storyPhrase, setStoryPhrase] = useState<string>("");

    const onStoryPhraseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStoryPhrase(e.target.value);
    }

    return (
        <>
            <DisplayCard card={card}/>
            <textarea className="dixit-card-description" placeholder="請說出你的故事"
                      maxLength={40} onChange={onStoryPhraseChange}>{storyPhrase}</textarea>
            <CardDecision className="dixit-card-decision"
                          onConfirm={() => onConfirmButtonClick(card.id, storyPhrase)} onCancel={onCancelButtonClick}/>
        </>
    );
}

const PlayCardDescription = ({card, onConfirmButtonClick, onCancelButtonClick}: CardDescriptionProp) => {
    return (
        <>
            <DisplayCard card={card}/>
            <span className="dixit-card-description">打它？</span>
            <CardDecision className="dixit-card-decision"
                          onConfirm={() => onConfirmButtonClick(card.id)} onCancel={onCancelButtonClick}/>
        </>
    );
}

const GuessDescription = ({card, onConfirmButtonClick, onCancelButtonClick}: CardDescriptionProp) => {
    return (
        <>
            <DisplayCard card={card}/>
            <span className="dixit-card-description">猜它？</span>
            <CardDecision className="dixit-card-decision"
                          onConfirm={() => onConfirmButtonClick(card.id)} onCancel={onCancelButtonClick}/>
        </>
    );
}

export {StoryDescription, PlayCardDescription, GuessDescription};