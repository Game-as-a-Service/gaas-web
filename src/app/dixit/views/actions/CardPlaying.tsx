import {PlayCardDescription} from "../cards/descriptions/CardDescription";
import React, {useState} from "react";
import Card from "../../models/model/Card";
import Notification from "../Notification";
import HandCards from "../cards/handcards/HandCards";
import {dixitService} from "../../services/services";
import {DixitContextValue, useDixitContext} from "../Dixit";
import DixitOverview from "../../models/DixitOverview";
import PlayCard from "../../models/model/PlayCard";
import './CardPlaying.scss';

const CardPlaying = () => {
    const {dixitId, playerId, dixitOverview}: DixitContextValue = useDixitContext();
    const {rounds, handCards, storyteller, story, playCards}: DixitOverview = dixitOverview;
    const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);

    const onPlayCardConfirm = (cardId: number) => {
        dixitService.playCard(dixitId, rounds, playerId, {cardId})
            .then();
    }

    const onPlayCardCancel = () => {
        setSelectedCard(undefined);
    }

    const onHandCardClick = (handCard: Card) => {
        setSelectedCard(handCard);
    }

    const PlayCards = () => {
        return (
            <div className="dixit-playCards">
                {
                    playCards.map(({player, card}: PlayCard) =>
                        <div className="dixit-playCard-zone">
                            <p key={card.id} className={player.color}>{player.name.substr(0, 7)}</p>
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
                    playCards.find(({player}: PlayCard) => player.id === playerId) ? <PlayCards/>
                        : (
                            <>
                                {
                                    selectedCard ?
                                        <PlayCardDescription story={story}
                                                             card={selectedCard}
                                                             onConfirmButtonClick={onPlayCardConfirm}
                                                             onCancelButtonClick={onPlayCardCancel}/>
                                        : <Notification message={isStoryTeller ? `其他玩家正在打牌` : `你是玩家，請打出與謎語相似的牌`}/>
                                }
                                {
                                    isStoryTeller ? <></> : <HandCards handCards={handCards}
                                                                       onHandCardClick={onHandCardClick}/>
                                }
                            </>
                        )
                }
            </>
        );
    }
    return <></>
}

export default CardPlaying;