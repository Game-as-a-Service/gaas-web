import React, {useEffect, useState} from "react";
import {PLAYER_GUESSING} from "../../models/model/RoundState";
import Card from "../../models/model/Card";
import EventNotice from "../EventNotice";
import PlayCards from "../cards/handcards/PlayCards";
import {GuessDescription} from "../cards/descriptions/CardDescription";
import {dixitService} from "../../models/services/services";
import {Subscription} from "rxjs";
import DixitRoundPlayerGuessingEvent from "../../models/events/roundstate/DixitRoundPlayerGuessingEvent";
import {DixitContextValue, useDixitContext} from "../Dixit";
import DixitDuringRoundPlayerGuessingEvent from "../../models/events/during/DixitDuringRoundPlayerGuessingEvent";
import Event from "../../models/events/Event";

const PlayerGuessing = () => {
    const {dixitId, playerId, dixitOverview, setDixitOverview}: DixitContextValue = useDixitContext();
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

    const onDixitPlayerGuessing = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitRoundPlayerGuessingEvent) {
                const dixitRoundPlayerGuessingEvent: DixitRoundPlayerGuessingEvent = event as DixitRoundPlayerGuessingEvent;
                setDixitOverview({
                    ...dixitOverview,
                    roundState: dixitRoundPlayerGuessingEvent.roundState,
                    rounds: dixitRoundPlayerGuessingEvent.rounds,
                    playCards: dixitRoundPlayerGuessingEvent.playCards
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const onDixitDuringPlayerGuessing = (dixitDuringRoundPlayerGuessingEvent: DixitDuringRoundPlayerGuessingEvent) => {
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const onGuessConfirm = (cardId: number) => {
        dixitService.guessStory(dixitId, dixitOverview.rounds, playerId, {cardId})
            .then(() => setDixitOverview({...dixitOverview, playCards: []}))
            .then(() => setSelectedCard(undefined));
    }

    const onGuessCancel = () => {
        setDixitOverview({...dixitOverview, roundState: PLAYER_GUESSING});
    }

    const onPlayCardClick = (e: React.MouseEvent<HTMLElement>, playCardId: number) => {
        const card: Card | undefined = dixitOverview.playCards.find(playCard => playCard.card.id === playCardId)?.card;
        setSelectedCard(card);
    }

    const isPlayerGuessing: boolean = PLAYER_GUESSING === dixitOverview.roundState;
    if (isPlayerGuessing) {
        return (
            <>
                {
                    selectedCard ?
                        <GuessDescription card={selectedCard}
                                          onConfirmButtonClick={onGuessConfirm}
                                          onCancelButtonClick={onGuessCancel}/>
                        : <EventNotice dixitState={dixitOverview.roundState}/>
                }
                <PlayCards dixitState={dixitOverview.roundState}
                           playCards={dixitOverview.playCards}
                           onPlayCardClick={onPlayCardClick}/>
            </>
        );
    }
    return <></>
}

export default PlayerGuessing;