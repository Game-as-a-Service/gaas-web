import React from "react";
import {GAME_OVER} from "../../models/model/GameState";
import {DixitContextValue, useDixitContext} from "../Dixit";
import DixitOverview from "../../models/DixitOverview";
import ScoreBoard from "../exhibition/ScoreBoard";

const DixitRanking = () => {
    const {dixitOverview}: DixitContextValue = useDixitContext();
    const {gameState, winners}: DixitOverview = dixitOverview;

    const isGameOver: boolean = GAME_OVER === gameState;
    if (isGameOver) {
        return <ScoreBoard players={winners}/>;
    }
    return <></>;
}

export default DixitRanking;