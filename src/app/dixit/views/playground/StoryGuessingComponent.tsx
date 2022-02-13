import React, {useState} from "react";
import Card from "../../models/model/Card";
import NotificationComponent from "../NotificationComponent";
import PlayCardsComponent from "../cards/handcards/PlayCardsComponent";
import {GuessDescriptionComponent} from "../cards/descriptions/CardDescriptionComponent";
import {dixitService} from "../../services/services";
import {DixitContextValue, useDixitContext} from "../DixitComponent";
import DixitOverview from "../../models/DixitOverview";
import PlayCard from "../../models/model/PlayCard";
import Guess from "../../models/model/Guess";
import './StoryGuessingComponent.scss';

const StoryGuessingComponent = () => {
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

    const onPlayCardClick = ({player, card}: PlayCard) => {
        if (playerId !== player.id) {
            setSelectedCard(card);
        }
    }

    const Guesses = () => {
        return (
            <div className="dixit-guesses">
                {
                    playCards.map(({card}: PlayCard) =>
                        <div>
                            <img className="dixit-playCard" alt="card"
                                 src={`data:image/png;base64, ${card.image}`}/>
                            {
                                guesses.filter(({playCard}: Guess) => card.id === playCard.card.id)
                                    .map(({guesser}: Guess) => <div className="dixit-guess"><p
                                        className={guesser.color}>{guesser.name}</p></div>)
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
            <div className="story-guessing-component-position">
                {
                    isStoryTeller || guesses.find(({guesser}: Guess) => guesser.id === playerId) ? <Guesses/>
                        : (
                            <>
                                {
                                    selectedCard ?
                                        <div className="description-position">
                                            <GuessDescriptionComponent card={selectedCard}
                                                                       onConfirmButtonClick={onGuessConfirm}
                                                                       onCancelButtonClick={onGuessCancel}/>
                                        </div>
                                        : <div className="notification-position">
                                            <NotificationComponent message={isStoryTeller ? `其他玩家正在猜牌` : `你是玩家，請猜出與謎語相似的牌`}/>
                                        </div>
                                }
                                <div className="playCards-position">
                                    {
                                        isStoryTeller ? <></> : <PlayCardsComponent playerId={playerId}
                                                                                    playCards={playCards}
                                                                                    onPlayCardClick={onPlayCardClick}/>
                                    }
                                </div>
                            </>
                        )
                }
            </div>
        );
    }
    return <></>
}

export default StoryGuessingComponent;