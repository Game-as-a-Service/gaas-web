import React from "react";
import {DixitContextValue, useDixitContext} from "../DixitComponent";
import {SCORING} from "../../models/model/RoundState";
import DixitOverview from "../../models/DixitOverview";
import ScoreBoardComponent from "../scoreboard/ScoreBoardComponent";

const ScoringComponent = () => {
    const {dixitOverview}: DixitContextValue = useDixitContext();
    const {roundState, players}: DixitOverview = dixitOverview;

    const isScoring: boolean = SCORING === roundState;
    return isScoring ? <ScoreBoardComponent players={players}/> : <></>
}

export default ScoringComponent;