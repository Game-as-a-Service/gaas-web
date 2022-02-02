import React from "react";
import {OVER} from "../../models/model/GameState";
import {DixitContextValue, useDixitContext} from "../Dixit";
import DixitOverview from "../../models/DixitOverview";
import ScoreBoard from "../exhibition/ScoreBoard";

const DixitRanking = () => {
    const {dixitOverview}: DixitContextValue = useDixitContext();
    const {gameState, winners}: DixitOverview = dixitOverview;

    const isGameOver: boolean = OVER === gameState;
    if (isGameOver) {
        return <ScoreBoard players={winners}/>;
    }
    return <></>;
}

export default DixitRanking;