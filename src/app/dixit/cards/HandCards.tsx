import {CARD_PLAYING, RoundState, STORY_TELLING} from "../domain/RoundState";
import React from "react";
import Card from "../domain/Card";

interface HandCardsProp {
    dixitState: RoundState;
    handCards: Array<Card>;
    onHandCardClick: (e: React.MouseEvent<HTMLElement>, handCardId: number) => void;
}

const HandCards = (prop: HandCardsProp) => {
    const dixitState: RoundState = prop.dixitState;
    const handCards: Array<Card> = prop.handCards;
    const isStoryTelling: boolean = STORY_TELLING === dixitState;
    const isCardPlaying: boolean = CARD_PLAYING === dixitState;

    if (isStoryTelling || isCardPlaying) {
        const isHandCardsEmpty = handCards.length === 0;
        if (!isHandCardsEmpty) {
            return <div className="dixit-cards">
                {
                    handCards.map(handCard => {
                        return <img className="dixit-card" alt="card"
                                    src={`data:image/png;base64, ${handCard.image}`}
                                    onClick={e => prop.onHandCardClick(e, handCard.id)}/>
                    })
                }
            </div>
        }
    }
    return <></>
}

export default HandCards;