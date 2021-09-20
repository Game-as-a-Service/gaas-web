import React, {useEffect, useState} from "react";
import {PLAYER_GUESSING, RoundState} from "../model/domain/RoundState";
import PlayCard from "../model/domain/PlayCard";
import Card from "../model/domain/Card";
import EventNotice from "../EventNotice";
import PlayCards from "../cards/handcards/PlayCards";
import {GuessDescription} from "../cards/descriptions/CardDescription";
import {dixitService} from "../services/services";
import {Subscription} from "rxjs";
import DixitRoundPlayerGuessingEvent from "../model/events/DixitRoundPlayerGuessingEvent";
import {DixitRequest} from "../services/DixitService";

let rounds: number = 0;
let roundStateBackup: RoundState = undefined;
const Guess = () => {
    const [roundState, setRoundState] = useState<RoundState>(roundStateBackup);
    const [playCards, setPlayCards] = useState<PlayCard[]>([]);
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
        subscriptions.push(dixitService.subscribeToDixitPlayerGuessingEvent(dixitId, playerId, onDixitPlayerGuessing));
    }

    const onDixitPlayerGuessing = (dixitRoundPlayerGuessingEvent: DixitRoundPlayerGuessingEvent) => {
        rounds = dixitRoundPlayerGuessingEvent.rounds;
        roundStateBackup = dixitRoundPlayerGuessingEvent.roundState;
        setRoundState(roundStateBackup);
        setPlayCards(dixitRoundPlayerGuessingEvent.playCards);
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const onGuessConfirm = (cardId: number) => {
        let request: DixitRequest = new DixitRequest(cardId);
        dixitService.guessStory(dixitId, rounds, playerId, request)
            .then(() => {
                setPlayCards([]);
                setSelectedCard(undefined);
                setRoundState(undefined);
            });
    }

    const onGuessCancel = () => {
        setRoundState(roundStateBackup);
        setSelectedCard(undefined);
    }

    const onPlayCardClick = (e: React.MouseEvent<HTMLElement>, playCardId: number) => {
        const card: Card | undefined = playCards?.find(playCard => playCard.card.id === playCardId)?.card;
        setSelectedCard(card);
    }

    const isPlayerGuessing: boolean = PLAYER_GUESSING === roundState;
    if (isPlayerGuessing) {
        return <>
            {
                selectedCard ?
                    <GuessDescription card={selectedCard}
                                      onConfirmButtonClick={onGuessConfirm}
                                      onCancelButtonClick={onGuessCancel}/>
                    : <EventNotice dixitState={roundState}/>
            }
            <PlayCards dixitState={roundState} playCards={playCards} onPlayCardClick={onPlayCardClick}/>
        </>
    }
    return <></>
}

export default Guess;