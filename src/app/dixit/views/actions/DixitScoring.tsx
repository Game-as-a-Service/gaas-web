import React, {useEffect} from "react";
import {SCORING} from "../../models/model/RoundState";
import Guesses from "../cards/guesses/Guesses";
import {dixitService} from "../../models/services/services";
import {Subscription} from "rxjs";
import DixitRoundScoringEvent from "../../models/events/roundstate/DixitRoundScoringEvent";
import {DixitContextValue, useDixitContext} from "../Dixit";
import Event from "../../models/events/Event";

const DixitScoring = () => {
    const {dixitId, playerId, dixitOverview, setDixitOverview}: DixitContextValue = useDixitContext();
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

    const onDixitScoring = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitRoundScoringEvent) {
                const dixitRoundScoringEvent: DixitRoundScoringEvent = event as DixitRoundScoringEvent;
                setDixitOverview({
                    ...dixitOverview,
                    roundState: dixitRoundScoringEvent.roundState,
                    rounds: dixitRoundScoringEvent.rounds,
                    playCards: dixitRoundScoringEvent.playCards,
                    guesses: dixitRoundScoringEvent.guesses
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
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