import React, {useEffect} from "react";
import {SCORING} from "../../models/model/RoundState";
import Guesses from "../cards/guesses/Guesses";
import {dixitService} from "../../models/services/services";
import DixitRoundScoringEvent from "../../models/events/roundstate/DixitRoundScoringEvent";
import {DixitContextValue, useDixitContext} from "../Dixit";
import Event from "../../models/events/Event";
import DixitOverview from "../../models/DixitOverview";

const DixitScoring = () => {
    const {dixitId, playerId, dixitOverview, setDixitOverview}: DixitContextValue = useDixitContext();


    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        dixitService.subscribeToDixitScoringEvent(dixitId, playerId, onDixitScoring);
    }

    const onDixitScoring = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitRoundScoringEvent) {
                const dixitRoundScoringEvent: DixitRoundScoringEvent = event as DixitRoundScoringEvent;
                setDixitOverview((dixitOverview: DixitOverview) => {
                    return {
                        ...dixitOverview,
                        roundState: dixitRoundScoringEvent.roundState,
                        playCards: dixitRoundScoringEvent.playCards,
                        guesses: dixitRoundScoringEvent.guesses,
                        players: dixitRoundScoringEvent.players
                    };
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const unsubscribeEvents = () => {
        dixitService.clearSubscriptions();
    }

    const isScoring: boolean = SCORING === dixitOverview.roundState;
    if (isScoring) {
        return <Guesses dixitState={dixitOverview.roundState}
                        playCards={dixitOverview.playCards}
                        guesses={dixitOverview.guesses}/>;
    }
    return <></>;
}

export default DixitScoring;