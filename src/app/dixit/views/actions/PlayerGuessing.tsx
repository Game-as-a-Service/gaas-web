import React, {useState} from "react";
import Card from "../../models/model/Card";
import Notification from "../Notification";
import PlayCards from "../cards/handcards/PlayCards";
import {GuessDescription} from "../cards/descriptions/CardDescription";
import {dixitService} from "../../models/services/services";
import {DixitContextValue, useDixitContext} from "../Dixit";
import DixitOverview from "../../models/DixitOverview";
import PlayCard from "../../models/model/PlayCard";
import Guess from "../../models/model/Guess";
import './PlayerGuessing.scss';

const PlayerGuessing = () => {
    const {dixitId, playerId, dixitOverview}: DixitContextValue = useDixitContext();
    const {rounds, storyteller, playCards, guesses}: DixitOverview = dixitOverview;
    const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);

    const onGuessConfirm = (cardId: number) => {
        dixitService.guessStory(dixitId, rounds, playerId, {cardId})
            .then();
    }

    const onGuessCancel = () => {
        setSelectedCard(undefined);
    }

    const onPlayCardClick = (playCard: Card) => {
        setSelectedCard(playCard);
    }

    const Guesses = () => {
        return (
            <div className="dixit-guesses">
                {
                    playCards.map(({card}: PlayCard) =>
                        <div className="dixit-guess-zone">
                            <img className="dixit-guess" alt="card"
                                 src={`data:image/png;base64, ${card.image}`}/>
                            {
                                guesses.filter(({playCard}: Guess) => card.id === playCard.card.id)
                                    .map(({guesser}: Guess) =>
                                        <p className={guesser.color}
                                           style={{
                                               width: "140px", height: "30px",
                                               textAlign: "center", fontSize: "20px", fontWeight: "bold",
                                               background: "#403F48", color: "#95A792", marginTop: "10px"
                                           }}>{guesser.name}</p>)
                            }
                        </div>
                    )
                }
            </div>
        );
    }

    if (storyteller) {
        const isStoryTeller: boolean = playerId === storyteller.id;
        return (
            <>
                {
                    isStoryTeller || guesses.find(({guesser}: Guess) => guesser.id === playerId) ? <Guesses/>
                        : (
                            <>
                                {
                                    selectedCard ?
                                        <GuessDescription card={selectedCard}
                                                          onConfirmButtonClick={onGuessConfirm}
                                                          onCancelButtonClick={onGuessCancel}/>
                                        : <Notification message={isStoryTeller ? `其他玩家正在猜牌` : `你是玩家，請猜出與謎語相似的牌`}/>
                                }
                                {
                                    isStoryTeller ? <></> : <PlayCards playCards={playCards}
                                                                       onPlayCardClick={onPlayCardClick}/>
                                }
                            </>
                        )
                }
            </>
        );
    }
    return <></>
}

export default PlayerGuessing;