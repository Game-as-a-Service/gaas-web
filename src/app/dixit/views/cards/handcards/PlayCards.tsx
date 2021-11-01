import './Cards.scss';
import PlayCard from "../../../models/model/PlayCard";
import React from "react";
import Card from "../../../models/model/Card";

interface PlayCardsProp {
    playCards: Array<PlayCard>;
    onPlayCardClick: (handCard: Card) => void;
}

const PlayCards = ({playCards, onPlayCardClick}: PlayCardsProp) => {
    if (playCards.length > 0) {
        return (
            <div className="dixit-cards">
                {
                    playCards.map(({card}: PlayCard) =>
                        <img key={card.id} className="dixit-card" alt="card"
                             src={`data:image/png;base64, ${card.image}`}
                             onClick={() => onPlayCardClick(card)}/>)
                }
            </div>
        );
    }
    return <></>
}

export default PlayCards;