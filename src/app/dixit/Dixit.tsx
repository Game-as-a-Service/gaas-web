import './Dixit.scss';
import React, {useContext} from "react";
import {DixitContextProp} from "./DixitContext";
import PlayerBar from "./playerbar/PlayerBar";
import StoryTelling from "./actions/StoryTelling";
import CardPlaying from './actions/CardPlaying';
import PlayerGuessing from "./actions/PlayerGuessing";
import DixitRoundScoring from "./actions/DixitRoundScoring";
import DixitGameRank from "./actions/DixitGameRank";

export const DixitContext = React.createContext<DixitContextProp>(new DixitContextProp('dixitId', '0'));

export const useDixitContext = () => {
    return useContext(DixitContext);
};

const Dixit = () => {
    const dixitId: string = 'dixitId';
    const playerId: string = '0';
    const [dixitContextValue] = React.useState<DixitContextProp>(new DixitContextProp(dixitId, playerId));

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
    );
}

export default Dixit;