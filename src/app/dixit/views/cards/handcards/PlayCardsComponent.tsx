import './CardsComponent.scss';
import PlayCard from "../../../models/model/PlayCard";
import React from "react";

interface PlayCardsProperties {
    playerId: string;
    playCards: Array<PlayCard>;
    onPlayCardClick: (handCard: PlayCard) => void;
}

const PlayCardsComponent = ({playerId, playCards, onPlayCardClick}: PlayCardsProperties) => {
    return (
        <>
            {
                playCards.length > 0 ?
                    <div className="dixit-cards">
                        {
                            playCards.map((playCard: PlayCard) =>
                                <img key={playCard.card.id}
                                     className={playerId === playCard.player.id ? playCard.player.color : "dixit-card"}
                                     alt="card"
                                     src={`data:image/png;base64, ${playCard.card.image}`}
                                     onClick={() => onPlayCardClick(playCard)}/>
                            )
                        }
                    </div> : <></>
            }
        </>
    );
}

export default PlayCardsComponent;