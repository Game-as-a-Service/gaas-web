import './Dixit.scss';
import React, {createContext, useContext, useEffect, useState} from "react";
import PlayerBar from "./playerbar/PlayerBar";
import StoryTelling from "./actions/StoryTelling";
import CardPlaying from './actions/CardPlaying';
import PlayerGuessing from "./actions/PlayerGuessing";
import DixitScoring from "./actions/DixitScoring";
import DixitRanking from "./actions/DixitRanking";
import {dixitService} from "../models/services/services";
import DixitOverview from "../models/DixitOverview";

type DixitOverviewState = DixitOverview | ((prevDixitOverview: DixitOverview) => DixitOverview);

export interface DixitContextValue {
    dixitId: string,
    playerId: string,
    dixitOverview: DixitOverview,
    setDixitOverview: (dixitOverviewState: DixitOverviewState) => void;
}

export const DixitContext = createContext<DixitContextValue>({
    dixitId: 'dixitId',
    playerId: '0',
    dixitOverview: DixitOverview.defaultDixitOverview,
    setDixitOverview: () => void {}
});

export const useDixitContext = () => {
    return useContext(DixitContext);
};

const Dixit = () => {
    const port: string = window.location.port;
    const dixitId: string = 'dixitId';
    const playerId: string = port.charAt(port.length - 1);
    const [dixitOverview, setDixitOverview] = useState<DixitOverview>(DixitOverview.defaultDixitOverview);
    const dixitContext: DixitContextValue = {dixitId, playerId, dixitOverview, setDixitOverview};

    useEffect(() => {
        if (dixitOverview === DixitOverview.defaultDixitOverview) {
            dixitService.getDixitOverview(dixitId, playerId)
                .then(setDixitOverview)
                .catch(()=> dixitService.initializeDixit());
        }
    }, [dixitOverview, dixitId, playerId]);

    return (
        <DixitContext.Provider value={dixitContext}>
            <div className="dixit">
                <PlayerBar/>
                <StoryTelling/>
                <CardPlaying/>
                <PlayerGuessing/>
                <DixitScoring/>
                <DixitRanking/>
            </div>
        </DixitContext.Provider>
    );
}

export default Dixit;