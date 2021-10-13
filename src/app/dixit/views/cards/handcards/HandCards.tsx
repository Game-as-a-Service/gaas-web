import './HandCards.scss';
import {CARD_PLAYING, RoundState, STORY_TELLING} from "../../../models/model/RoundState";
import React from "react";
import Card from "../../../models/model/Card";

interface HandCardsProp {
    dixitState: RoundState;
    handCards: Array<Card>;
    onHandCardClick: (e: React.MouseEvent<HTMLElement>, handCardId: number) => void;
}

const HandCards = ({dixitState, handCards, onHandCardClick}: HandCardsProp) => {
    const isStoryTelling: boolean = STORY_TELLING === dixitState;
    const isCardPlaying: boolean = CARD_PLAYING === dixitState;

    if (isStoryTelling || isCardPlaying) {
        const isHandCardsEmpty = handCards.length === 0;
        if (!isHandCardsEmpty) {
            return (
                <div className="dixit-cards">
                    {
                        handCards.map(handCard => {
                            return <img className="dixit-card" alt="card"
                                        src={`data:image/png;base64, ${handCard.image}`}
                                        onClick={e => onHandCardClick(e, handCard.id)}/>
                        })
                    }
                </div>
            );
        }
    }
    return <></>
}

export default HandCards;