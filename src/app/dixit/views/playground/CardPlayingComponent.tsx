import {PlayCardDescriptionComponent} from "../cards/descriptions/CardDescriptionComponent";
import React, {useState} from "react";
import Card from "../../models/model/Card";
import NotificationComponent from "../NotificationComponent";
import HandCardsComponent from "../cards/handcards/HandCardsComponent";
import {dixitService} from "../../services/services";
import {DixitContextValue, useDixitContext} from "../DixitComponent";
import DixitOverview from "../../models/DixitOverview";
import PlayCard from "../../models/model/PlayCard";
import './CardPlayingComponent.scss';

const CardPlayingComponent = () => {
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
                    playCards.map(({player}: PlayCard) =>
                        <div key={player.id} className={player.color}>{player.name.substr(0, 7)}</div>
                    )
                }
            </div>
        );
    }

    if (storyteller) {
        const isStoryTeller: boolean = playerId === storyteller.id;
        return (
            <div className="card-playing-component-position">
                {
                    playCards.find(({player}: PlayCard) => player.id === playerId) ? <PlayCards/>
                        : (
                            <>
                                {
                                    selectedCard ?
                                        <div className="description-position">
                                            <PlayCardDescriptionComponent story={story}
                                                                          card={selectedCard}
                                                                          onConfirmButtonClick={onPlayCardConfirm}
                                                                          onCancelButtonClick={onPlayCardCancel}/>
                                        </div>
                                        :
                                        <div className="notification-position">
                                            <NotificationComponent message={isStoryTeller ? `其他玩家正在打牌` : `你是玩家，請打出與謎語相似的牌`}/>
                                        </div>
                                }
                                <div className="handCards-position">
                                    {
                                        isStoryTeller ? <></> : <HandCardsComponent handCards={handCards}
                                                                                    onHandCardClick={onHandCardClick}/>
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

export default CardPlayingComponent;