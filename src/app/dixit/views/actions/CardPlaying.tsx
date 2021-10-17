import {PlayCardDescription} from "../cards/descriptions/CardDescription";
import React, {useEffect, useState} from "react";
import Card from "../../models/model/Card";
import {CARD_PLAYING} from "../../models/model/RoundState";
import EventNotice from "../EventNotice";
import HandCards from "../cards/handcards/HandCards";
import {dixitService} from "../../models/services/services";
import DixitRoundCardPlayingEvent from "../../models/events/roundstate/DixitRoundCardPlayingEvent";
import {DixitContextValue, useDixitContext} from "../Dixit";
import DixitDuringRoundCardPlayingEvent from "../../models/events/during/DixitDuringRoundCardPlayingEvent";
import Event from "../../models/events/Event";
import DixitOverview from "../../models/DixitOverview";

const CardPlaying = () => {
    const {dixitId, playerId, dixitOverview, setDixitOverview}: DixitContextValue = useDixitContext();
    const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);


    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        dixitService.subscribeToDixitCardPlayingEvent(dixitId, playerId, onDixitCardPlaying);
        dixitService.subscribeToDixitDuringRoundCardPlayingEvent(dixitId, playerId, onDixitDuringCardPlaying);
    }

    const onDixitCardPlaying = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitRoundCardPlayingEvent) {
                const dixitRoundCardPlayingEvent: DixitRoundCardPlayingEvent = event as DixitRoundCardPlayingEvent;
                setDixitOverview((dixitOverview: DixitOverview) => {
                    return {
                        ...dixitOverview,
                        story: dixitRoundCardPlayingEvent.story,
                        roundState: dixitRoundCardPlayingEvent.roundState,
                        rounds: dixitRoundCardPlayingEvent.rounds,
                        handCards: dixitRoundCardPlayingEvent.handCards
                    };
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const onDixitDuringCardPlaying = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitDuringRoundCardPlayingEvent) {
                const dixitDuringRoundCardPlayingEvent: DixitDuringRoundCardPlayingEvent = event as DixitDuringRoundCardPlayingEvent;
                setDixitOverview((dixitOverview: DixitOverview) => {
                    return {
                        ...dixitOverview,
                        rounds: dixitDuringRoundCardPlayingEvent.rounds,
                        playCards: dixitDuringRoundCardPlayingEvent.playCards
                    };
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const unsubscribeEvents = () => {
        dixitService.clearSubscriptions();
    }

    const onPlayCardConfirm = (cardId: number) => {
        dixitService.playCard(dixitId, dixitOverview.rounds, playerId, {cardId})
            .then(() => {
                setDixitOverview((dixitOverview: DixitOverview) => {
                    return {...dixitOverview, handCards: []};
                });
                setSelectedCard(undefined);
            });
    }

    const onPlayCardCancel = () => {
        setDixitOverview((dixitOverview: DixitOverview) => {
            return {...dixitOverview, roundState: CARD_PLAYING};
        });
        setSelectedCard(undefined);
    }

    const onHandCardClick = (e: React.MouseEvent<HTMLElement>, handCardId: number) => {
        const card: Card | undefined = dixitOverview.handCards.find(card => card.id === handCardId);
        setSelectedCard(card);
    }

    const isCardPlaying: boolean = CARD_PLAYING === dixitOverview.roundState;
    if (isCardPlaying) {
        return (
            <>
                {
                    selectedCard ?
                        <PlayCardDescription card={selectedCard}
                                             onConfirmButtonClick={onPlayCardConfirm}
                                             onCancelButtonClick={onPlayCardCancel}/>
                        : <EventNotice dixitState={dixitOverview.roundState}/>
                }
                <HandCards dixitState={dixitOverview.roundState}
                           handCards={dixitOverview.handCards}
                           onHandCardClick={onHandCardClick}/>
            </>
        );
    }
    return <></>;
}

export default CardPlaying;