import './CardDescription.scss';
import React, {useState} from "react";
import Card from "../../model/domain/Card";
import DisplayCard from "../../displaycard/DisplayCard";
import CardDecision from "../decisons/CardDecision";

interface CardDescriptionProp {
    card: Card;
    onConfirmButtonClick: () => void;
    onCancelButtonClick: () => void;
}

const StoryDescription = (prop: CardDescriptionProp) => {
    const [storyPhrase, setStoryPhrase] = useState<string>("");
    const card: Card = prop.card;

    const onStoryPhraseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStoryPhrase(e.target.value);
    }

    const onConfirmButtonClick = () => {
        prop.onConfirmButtonClick();
    }

    const onCancelButtonClick = () => {
        prop.onCancelButtonClick();
    }

    return <>
        <DisplayCard card={card}/>
        <textarea className="dixit-card-description" placeholder="請說出你的故事"
                  maxLength={40} onChange={onStoryPhraseChange}>{storyPhrase}</textarea>
        <CardDecision className="dixit-card-decision"
                      onConfirm={onConfirmButtonClick} onCancel={onCancelButtonClick}/>
    </>;
}

const PlayCardDescription = (prop: CardDescriptionProp) => {
    const card: Card = prop.card;

    const onConfirmButtonClick = () => {
        prop.onConfirmButtonClick();
    }

    const onCancelButtonClick = () => {
        prop.onCancelButtonClick();
    }

    return <>
        <DisplayCard card={card}/>
        <span className="dixit-card-description">打它？</span>
        <CardDecision className="dixit-card-decision"
                      onConfirm={onConfirmButtonClick} onCancel={onCancelButtonClick}/>
    </>;
}

const GuessDescription = (prop: CardDescriptionProp) => {
    const card: Card = prop.card;

    const onConfirmButtonClick = () => {
        prop.onConfirmButtonClick();
    }

    const onCancelButtonClick = () => {
        prop.onCancelButtonClick();
    }

    return <>
        <DisplayCard card={card}/>
        <span className="dixit-card-description">猜它？</span>
        <CardDecision className="dixit-card-decision"
                      onConfirm={onConfirmButtonClick} onCancel={onCancelButtonClick}/>
    </>;
}

export {StoryDescription, PlayCardDescription, GuessDescription};