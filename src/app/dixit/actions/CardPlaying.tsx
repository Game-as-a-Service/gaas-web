import {PlayCardDescription} from "../cards/descriptions/CardDescription";
import React, {useEffect, useState} from "react";
import Card from "../model/Card";
import {CARD_PLAYING} from "../model/RoundState";
import EventNotice from "../EventNotice";
import HandCards from "../cards/handcards/HandCards";
import {dixitService} from "../services/services";
import {Subscription} from "rxjs";
import DixitRoundCardPlayingEvent from "../events/roundstate/DixitRoundCardPlayingEvent";
import {DixitRequest} from "../services/DixitService";
import {useDixitContext} from "../Dixit";
import DixitDuringRoundCardPlayingEvent from "../events/during/DixitDuringRoundCardPlayingEvent";
import DixitContextProp from "../DixitContext";

const CardPlaying = () => {
    const {
        dixitId, playerId,
        rounds, setRounds,
        roundState, setRoundState,
        handCards, setHandCards,
        playCards, setPlayCards
    }: DixitContextProp = useDixitContext() as DixitContextProp;
    const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);
    const subscriptions: Array<Subscription> = [];

    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        subscriptions.push(dixitService.subscribeToDixitCardPlayingEvent(dixitId, playerId, onDixitCardPlaying));
        subscriptions.push(dixitService.subscribeToDixitDuringRoundCardPlayingEvent(dixitId, playerId, onDixitDuringCardPlaying));
    }

    const onDixitCardPlaying = (dixitRoundCardPlayingEvent: DixitRoundCardPlayingEvent) => {
        // show story view
        setRounds(dixitRoundCardPlayingEvent.rounds);
        setRoundState(dixitRoundCardPlayingEvent.roundState);
        setHandCards(dixitRoundCardPlayingEvent.handCards);
    }

    const onDixitDuringCardPlaying = (dixitDuringRoundCardPlayingEvent: DixitDuringRoundCardPlayingEvent) => {
        // setPlayCards(dixitDuringRoundCardPlayingEvent.playCards);
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const onPlayCardConfirm = (cardId: number) => {
        dixitService.playCard(dixitId, rounds, playerId, new DixitRequest(cardId))
            .then(() => setHandCards([]))
            .then(() => setSelectedCard(undefined))
            .then(() => setRoundState(undefined));
    }

    const onPlayCardCancel = () => {
        setRoundState(CARD_PLAYING);
        setSelectedCard(undefined);
    }

    const onHandCardClick = (e: React.MouseEvent<HTMLElement>, handCardId: number) => {
        const card: Card | undefined = handCards?.find(card => card.id === handCardId);
        setSelectedCard(card);
    }

    const isCardPlaying: boolean = CARD_PLAYING === roundState;
    if (isCardPlaying) {
        return <>
            {
                selectedCard ?
                    <PlayCardDescription card={selectedCard}
                                         onConfirmButtonClick={onPlayCardConfirm}
                                         onCancelButtonClick={onPlayCardCancel}/>
                    : <EventNotice dixitState={roundState}/>
            }
            <HandCards dixitState={roundState} handCards={handCards} onHandCardClick={onHandCardClick}/>
        </>
    }
    return <></>
}

export default CardPlaying;