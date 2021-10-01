import './Dixit.scss';
import React, {useContext, useState} from "react";
import PlayerBar from "./playerbar/PlayerBar";
import StoryTelling from "./actions/StoryTelling";
import CardPlaying from './actions/CardPlaying';
import PlayerGuessing from "./actions/PlayerGuessing";
import DixitRoundScoring from "./actions/DixitRoundScoring";
import DixitGameRank from "./actions/DixitGameRank";
import DixitContextValue from "./DixitContext";
import {GameState, PREPARING} from "./model/GameState";
import {RoundState} from "./model/RoundState";
import Card from "./model/Card";
import Story from "./model/Story";
import PlayCard from "./model/PlayCard";
import Guess from "./model/Guess";

export const DixitContext = React.createContext<DixitContextValue | undefined>(undefined);

export const useDixitContext = () => {
    return useContext(DixitContext);
};

const Dixit = () => {
    const [dixitId, setDixitId] = React.useState<string>('dixitId');
    const [playerId, setPlayerId] = React.useState<string>('0');
    const [rounds, setRounds] = useState<number>(0);
    const [gameState, setGameState] = React.useState<GameState>(PREPARING);
    const [roundState, setRoundState] = React.useState<RoundState>(undefined);
    const [handCards, setHandCards] = React.useState<Card[]>([]);
    const [story, setStory] = React.useState<Story | undefined>(undefined);
    const [playCards, setPlayCards] = React.useState<PlayCard[]>([]);
    const [guesses, setGuesses] = React.useState<Guess[]>([]);
    const dixitContextValue: DixitContextValue = {
        dixitId, setDixitId,
        playerId, setPlayerId,
        rounds, setRounds,
        gameState, setGameState,
        roundState, setRoundState,
        handCards, setHandCards,
        story, setStory,
        playCards, setPlayCards,
        guesses, setGuesses
    };

    return (
        <DixitContext.Provider value={dixitContextValue}>
            <div className="dixit">
                <PlayerBar/>
                <StoryTelling/>
                <CardPlaying/>
                <PlayerGuessing/>
                <DixitRoundScoring/>
                <DixitGameRank/>
            </div>
        </DixitContext.Provider>
    )
        ;
}

export default Dixit;