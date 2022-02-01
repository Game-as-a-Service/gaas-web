import './Cards.scss';
import React from "react";
import Card from "../../../models/model/Card";

interface HandCardsProp {
    handCards: Array<Card>;
    onHandCardClick: (handCard: Card) => void;
}

const HandCards = ({handCards, onHandCardClick}: HandCardsProp) => {
    if (handCards.length > 0) {
        return (
            <div className="dixit-cards">
                {
                    handCards.map(handCard =>
                        <img key={handCard.id} className="dixit-card" alt="card"
                             src={`data:image/png;base64, ${handCard.image}`}
                             onClick={() => onHandCardClick(handCard)}/>)
                }
            </div>
        );
    }
    return <></>
}

export default HandCards;