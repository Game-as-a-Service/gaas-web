import './CardDescription.scss';
import React from "react";
import Card from "../domain/Card";
import DisplayCard from "../displaycard/DisplayCard";
import CardDecision from "../carddecision/CardDecision";

interface StoryDescriptionProp {
    card: Card;
    description: string;
    onConfirmButtonClick: () => void;
    onCancelButtonClick: () => void;
}

const PlayCardDescription = (prop: StoryDescriptionProp) => {
    const card: Card = prop.card;

    const onConfirmButtonClick = () => {
        prop.onConfirmButtonClick();
    }

    const onCancelButtonClick = () => {
        prop.onCancelButtonClick();
    }

    return (
        <>
            <DisplayCard card={card}/>
            <span className="dixit-card-description">{`${prop.description}它？`}</span>
            <CardDecision className="dixit-card-decision"
                          onConfirm={onConfirmButtonClick} onCancel={onCancelButtonClick}/>
        </>
    );
}

export default PlayCardDescription;