import React, {useEffect, useState} from "react";
import PlayCard from "../model/domain/PlayCard";
import Story from "../model/domain/Story";
import Guess from "../model/domain/Guess";
import {RoundState, SCORING} from "../model/domain/RoundState";
import Guesses from "../cards/guesses/Guesses";
import {dixitService} from "../services/services";
import {Subscription} from "rxjs";
import DixitRoundScoringEvent from "../model/events/DixitRoundScoringEvent";
import {useDixitContext} from "../Dixit";

const Score = () => {
    const {dixitId, playerId} = useDixitContext();
    const [roundState, setRoundState] = useState<RoundState>(undefined);
    const [story, setStory] = useState<Story | undefined>(undefined);
    const [playCards, setPlayCards] = useState<PlayCard[]>([]);
    const [guesses, setGuesses] = useState<Guess[]>([]);
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
        setStory(dixitRoundScoringEvent.story);
        setPlayCards(dixitRoundScoringEvent.playCards);
        setGuesses(dixitRoundScoringEvent.guesses);
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const isStoryTelling: boolean = SCORING === roundState;
    if (isStoryTelling) {
        return <Guesses dixitState={roundState} story={story} playCards={playCards} guesses={guesses}/>
    }
    return <></>
}

export default Score;