import './Dixit.scss';
import React from "react";
import PlayerBar from "./playerbar/PlayerBar";
import Story from "./actions/Story";
import PlayCard from './actions/PlayCard';
import Guess from "./actions/Guess";
import Score from "./actions/Score";
import Rank from "./actions/Rank";

const Dixit = () => {
    return <>
        <div className="dixit">
            <PlayerBar/>
            <Story/>
            <PlayCard/>
            <Guess/>
            <Score/>
            <Rank/>
        </div>
    </>
}

export default Dixit;