import React from "react";
import {DixitContextValue, useDixitContext} from "../Dixit";
import {SCORING} from "../../models/model/RoundState";
import DixitOverview from "../../models/DixitOverview";
import ScoreBoard from "../exhibition/ScoreBoard";

const DixitScoring = () => {
    const {dixitOverview}: DixitContextValue = useDixitContext();
    const {roundState, players}: DixitOverview = dixitOverview;

    const isScoring: boolean = SCORING === roundState;
    if (isScoring) {
        return <ScoreBoard players={players}/>;
    }
    return <></>
}

export default DixitScoring;