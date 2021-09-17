import PlayCard from "../domain/PlayCard";
import React from "react";
import Card from "../domain/Card";
import {PLAYER_GUESSING, RoundState} from "../domain/RoundState";

interface PlayCardsProp {
    dixitState: RoundState;
    playCards: Array<PlayCard>;
    onPlayCardClick: (e: React.MouseEvent<HTMLElement>, handCardId: number) => void;
}

const PlayCards = (prop: PlayCardsProp) => {
    const dixitState: RoundState = prop.dixitState;
    const playCards: Array<PlayCard> = prop.playCards;

    const isPlayerGuessing: boolean = PLAYER_GUESSING === dixitState;
    const isPlayCardsEmpty = playCards.length === 0;
    if (isPlayerGuessing && !isPlayCardsEmpty) {
        return <div className="dixit-cards">
            {
                playCards.map(playCard => {
                    const card: Card = playCard.card;
                    return <img className="dixit-card" alt="card"
                                src={`data:image/png;base64, ${card.image}`}
                                onClick={e => prop.onPlayCardClick(e, card.id)}/>
                })
            }
        </div>
    }
    return <></>
}

export default PlayCards;