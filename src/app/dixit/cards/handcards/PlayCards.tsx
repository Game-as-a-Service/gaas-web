import './HandCards.scss';
import PlayCard from "../../model/PlayCard";
import React from "react";
import Card from "../../model/Card";
import {PLAYER_GUESSING, RoundState} from "../../model/RoundState";

interface PlayCardsProp {
    dixitState: RoundState;
    playCards: Array<PlayCard>;
    onPlayCardClick: (e: React.MouseEvent<HTMLElement>, handCardId: number) => void;
}

const PlayCards = ({dixitState, playCards, onPlayCardClick}: PlayCardsProp) => {
    const isPlayerGuessing: boolean = PLAYER_GUESSING === dixitState;
    const isPlayCardsEmpty = playCards.length === 0;
    if (isPlayerGuessing && !isPlayCardsEmpty) {
        return (
            <div className="dixit-cards">
                {
                    playCards.map(playCard => {
                        const card: Card = playCard.card;
                        return <img className="dixit-card" alt="card"
                                    src={`data:image/png;base64, ${card.image}`}
                                    onClick={e => onPlayCardClick(e, card.id)}/>
                    })
                }
            </div>
        );
    }
    return <></>
}

export default PlayCards;