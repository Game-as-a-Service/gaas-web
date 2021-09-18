import './Dixit.scss';
import React, {useState} from "react";
import Player from "./model/domain/Player";
import PlayerBar from "./playerbar/PlayerBar";
import Story from "./actions/Story";
import PlayCard from './actions/PlayCard';
import Guess from "./actions/Guess";
import Score from "./actions/Score";
import Rank from "./actions/Rank";
import {ROUND_OVER, RoundState} from "./model/domain/RoundState";

const Dixit = () => {
    const [roundState, setRoundState] = useState<RoundState>(ROUND_OVER);
    // When RoundState === ROUND_OVER，Then reset players
    const [players, setPlayers] = useState<Player[]>([
        new Player('1', 'player1', 'red', 30),
        new Player('2', 'player2', 'orange', 22),
        new Player('3', 'player3', 'yellow', 24),
        new Player('4', 'player4', 'green', 27),
        new Player('5', 'player5', 'blue', 29),
        new Player('6', 'player6', 'violet', 25)
    ]);

    return <>
        <div className="dixit">
            <PlayerBar players={players}/>
            <Story/>
            <PlayCard/>
            <Guess/>
            <Score/>
            <Rank/>
        </div>
    </>
}

export default Dixit;