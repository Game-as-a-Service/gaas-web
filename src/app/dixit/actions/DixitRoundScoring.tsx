import React, {useEffect} from "react";
import {SCORING} from "../model/RoundState";
import Guesses from "../cards/guesses/Guesses";
import {dixitService} from "../services/services";
import {Subscription} from "rxjs";
import DixitRoundScoringEvent from "../events/roundstate/DixitRoundScoringEvent";
import {useDixitContext} from "../Dixit";
import DixitContextProp from "../DixitContext";

const DixitRoundScoring = () => {
    const {
        dixitId, playerId,
        roundState, setRoundState,
        playCards, setPlayCards,
        guesses, setGuesses
    }: DixitContextProp = useDixitContext() as DixitContextProp;
    const subscriptions: Array<Subscription> = [];

    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        subscriptions.push(dixitService.subscribeToDixitScoringEvent(dixitId, playerId, onDixitScoring));
    }

    const onDixitScoring = (dixitRoundScoringEvent: DixitRoundScoringEvent) => {
        setRoundState(dixitRoundScoringEvent.roundState);
        setPlayCards(dixitRoundScoringEvent.playCards);
        setGuesses(dixitRoundScoringEvent.guesses);
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const isStoryTelling: boolean = SCORING === roundState;
    if (isStoryTelling) {
        return <Guesses dixitState={roundState} playCards={playCards} guesses={guesses}/>
    }
    return <></>
}

export default DixitRoundScoring;