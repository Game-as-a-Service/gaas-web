import './CardsComponent.scss';
import React from "react";
import Card from "../../../models/model/Card";

interface HandCardsProperties {
    handCards: Array<Card>;
    onHandCardClick: (handCard: Card) => void;
}

const HandCardsComponent = ({handCards, onHandCardClick}: HandCardsProperties) => {
    return (
        <>
            {
                handCards.length > 0 ?
                    <div className="dixit-cards">
                        {
                            handCards.map(handCard =>
                                <img key={handCard.id} className="dixit-card" alt="card"
                                     src={`data:image/png;base64, ${handCard.image}`}
                                     onClick={() => onHandCardClick(handCard)}/>)
                        }
                    </div> : <></>
            }
        </>
    );
}

export default HandCardsComponent;