import React from "react";
import {OVER} from "../../models/model/GameState";
import {DixitContextValue, useDixitContext} from "../DixitComponent";
import DixitOverview from "../../models/DixitOverview";
import ScoreBoardComponent from "../scoreboard/ScoreBoardComponent";

const RankingComponent = () => {
    const {dixitOverview}: DixitContextValue = useDixitContext();
    const {gameState, winners}: DixitOverview = dixitOverview;

    const isGameOver: boolean = OVER === gameState;
    return isGameOver ? <ScoreBoardComponent players={winners}/> : <></>;
}

export default RankingComponent;