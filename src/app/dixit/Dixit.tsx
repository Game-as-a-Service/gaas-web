import './Dixit.scss';
import React, {useContext} from "react";
import PlayerBar from "./playerbar/PlayerBar";
import Story from "./actions/Story";
import PlayCard from './actions/PlayCard';
import Guess from "./actions/Guess";
import Score from "./actions/Score";
import Rank from "./actions/Rank";

let dixitId: string = 'dixitId';
let playerId: string = '0';
const dixitContextValue: { dixitId: string, playerId: string } = {dixitId, playerId};

export const DixitContext = React.createContext<{ dixitId: string, playerId: string }>(dixitContextValue);

export const useDixitContext = () => {
    return useContext(DixitContext);
};

const Dixit = () => {
    return (
        <DixitContext.Provider value={dixitContextValue}>
            <div className="dixit">
                <PlayerBar/>
                <Story/>
                <PlayCard/>
                <Guess/>
                <Score/>
                <Rank/>
            </div>
        </DixitContext.Provider>
    );
}

export default Dixit;