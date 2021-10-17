import React, {useEffect, useState} from "react";
import {PLAYER_GUESSING} from "../../models/model/RoundState";
import Card from "../../models/model/Card";
import EventNotice from "../EventNotice";
import PlayCards from "../cards/handcards/PlayCards";
import {GuessDescription} from "../cards/descriptions/CardDescription";
import {dixitService} from "../../models/services/services";
import DixitRoundPlayerGuessingEvent from "../../models/events/roundstate/DixitRoundPlayerGuessingEvent";
import {DixitContextValue, useDixitContext} from "../Dixit";
import DixitDuringRoundPlayerGuessingEvent from "../../models/events/during/DixitDuringRoundPlayerGuessingEvent";
import Event from "../../models/events/Event";
import DixitOverview from "../../models/DixitOverview";

const PlayerGuessing = () => {
    const {dixitId, playerId, dixitOverview, setDixitOverview}: DixitContextValue = useDixitContext();
    const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);


    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        dixitService.subscribeToDixitPlayerGuessingEvent(dixitId, playerId, onDixitPlayerGuessing);
        dixitService.subscribeToDixitDuringRoundPlayerGuessingEvent(dixitId, playerId, onDixitDuringPlayerGuessing);
    }

    const onDixitPlayerGuessing = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitRoundPlayerGuessingEvent) {
                const dixitRoundPlayerGuessingEvent: DixitRoundPlayerGuessingEvent = event as DixitRoundPlayerGuessingEvent;
                setDixitOverview((dixitOverview: DixitOverview) => {
                    return {
                        ...dixitOverview,
                        roundState: dixitRoundPlayerGuessingEvent.roundState,
                        rounds: dixitRoundPlayerGuessingEvent.rounds,
                        playCards: dixitRoundPlayerGuessingEvent.playCards
                    };
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const onDixitDuringPlayerGuessing = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitDuringRoundPlayerGuessingEvent) {
                const dixitDuringRoundPlayerGuessingEvent: DixitDuringRoundPlayerGuessingEvent = event as DixitDuringRoundPlayerGuessingEvent;
                setDixitOverview((dixitOverview: DixitOverview) => {
                    return {
                        ...dixitOverview,
                        rounds: dixitDuringRoundPlayerGuessingEvent.rounds,
                        playCards: dixitDuringRoundPlayerGuessingEvent.playCards,
                        guesses: dixitDuringRoundPlayerGuessingEvent.guesses
                    };
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const unsubscribeEvents = () => {
        dixitService.clearSubscriptions();
    }

    const onGuessConfirm = (cardId: number) => {
        dixitService.guessStory(dixitId, dixitOverview.rounds, playerId, {cardId})
            .then(() => {
                setDixitOverview((dixitOverview: DixitOverview) => {
                    return {...dixitOverview, playCards: []};
                });
                setSelectedCard(undefined);
            });
    }

    const onGuessCancel = () => {
        setDixitOverview((dixitOverview: DixitOverview) => {
            return {...dixitOverview, roundState: PLAYER_GUESSING};
        });
        setSelectedCard(undefined);
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