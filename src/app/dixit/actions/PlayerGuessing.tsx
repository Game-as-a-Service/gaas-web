import React, {useEffect, useState} from "react";
import {PLAYER_GUESSING} from "../model/RoundState";
import Card from "../model/Card";
import EventNotice from "../EventNotice";
import PlayCards from "../cards/handcards/PlayCards";
import {GuessDescription} from "../cards/descriptions/CardDescription";
import {dixitService} from "../services/services";
import {Subscription} from "rxjs";
import DixitRoundPlayerGuessingEvent from "../events/roundstate/DixitRoundPlayerGuessingEvent";
import {DixitRequest} from "../services/DixitService";
import {useDixitContext} from "../Dixit";
import DixitDuringRoundPlayerGuessingEvent from "../events/during/DixitDuringRoundPlayerGuessingEvent";
import DixitContextProp from "../DixitContext";

const PlayerGuessing = () => {
    const {
        dixitId, playerId,
        rounds, setRounds,
        roundState, setRoundState,
        playCards, setPlayCards,
        guesses, setGuesses
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
        subscriptions.push(dixitService.subscribeToDixitPlayerGuessingEvent(dixitId, playerId, onDixitPlayerGuessing));
        subscriptions.push(dixitService.subscribeToDixitDuringRoundPlayerGuessingEvent(dixitId, playerId, onDixitDuringPlayerGuessing));
    }

    const onDixitPlayerGuessing = (dixitRoundPlayerGuessingEvent: DixitRoundPlayerGuessingEvent) => {
        setRounds(dixitRoundPlayerGuessingEvent.rounds);
        setRoundState(dixitRoundPlayerGuessingEvent.roundState);
        setPlayCards(dixitRoundPlayerGuessingEvent.playCards);
    }

    const onDixitDuringPlayerGuessing = (dixitDuringRoundPlayerGuessingEvent: DixitDuringRoundPlayerGuessingEvent) => {
        // setGuesses(dixitDuringRoundPlayerGuessingEvent.guesses);
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const onGuessConfirm = (cardId: number) => {
        let request: DixitRequest = new DixitRequest(cardId);
        dixitService.guessStory(dixitId, rounds, playerId, request)
            .then(() => setPlayCards([]))
            .then(() => setSelectedCard(undefined))
            .then(() => setRoundState(undefined));
    }

    const onGuessCancel = () => {
        setRoundState(PLAYER_GUESSING);
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

export default PlayerGuessing;