import './CardDescription.scss';
import React, {useState} from "react";
import Card from "../domain/Card";
import DisplayCard from "../displaycard/DisplayCard";
import CardDecision from "../carddecision/CardDecision";

interface StoryDescriptionProp {
    card: Card;
    onConfirmButtonClick: () => void;
    onCancelButtonClick: () => void;
}

const StoryDescription = (prop: StoryDescriptionProp) => {
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

    return (
        <>
            <DisplayCard card={card}/>
            <textarea className="dixit-card-description" placeholder="請說出你的故事"
                      maxLength={40} onChange={onStoryPhraseChange}>{storyPhrase}</textarea>
            <CardDecision className="dixit-card-decision"
                          onConfirm={onConfirmButtonClick} onCancel={onCancelButtonClick}/>
        </>
    );
}

export default StoryDescription;