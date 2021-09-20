import {PlayCardDescription} from "../cards/descriptions/CardDescription";
import React, {useEffect, useState} from "react";
import Card from "../model/domain/Card";
import {CARD_PLAYING, RoundState} from "../model/domain/RoundState";
import EventNotice from "../EventNotice";
import HandCards from "../cards/handcards/HandCards";
import {dixitService} from "../services/services";
import {Subscription} from "rxjs";
import DixitRoundCardPlayingEvent from "../model/events/DixitRoundCardPlayingEvent";
import {DixitRequest} from "../services/DixitService";

let rounds: number = 0;
let roundStateBackup: RoundState = undefined;
const PlayCard = () => {
    const [roundState, setRoundState] = useState<RoundState>(roundStateBackup);
    const [handCards, setHandCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);
    const subscriptions: Array<Subscription> = [];
    let dixitId: string = 'dixitId';
    let playerId: string = '1';

    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        subscriptions.push(dixitService.subscribeToDixitCardPlayingEvent(dixitId, playerId, onDixitCardPlaying));
    }

    const onDixitCardPlaying = (dixitRoundCardPlayingEvent: DixitRoundCardPlayingEvent) => {
        rounds = dixitRoundCardPlayingEvent.rounds;
        roundStateBackup = dixitRoundCardPlayingEvent.roundState;
        setRoundState(roundStateBackup);
        setHandCards(dixitRoundCardPlayingEvent.handCards);
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const onPlayCardConfirm = (cardId: number) => {
        let request: DixitRequest = new DixitRequest(cardId);
        dixitService.playCard(dixitId, rounds, playerId, request)
            .then(() => {
                setHandCards([]);
                setSelectedCard(undefined);
                setRoundState(undefined);
            });
    }

    const onPlayCardCancel = () => {
        setRoundState(roundStateBackup);
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

export default PlayCard;