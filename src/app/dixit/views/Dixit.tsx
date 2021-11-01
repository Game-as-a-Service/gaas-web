import './Dixit.scss';
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import PlayerBar from "./playerbar/PlayerBar";
import {dixitService} from "../models/services/services";
import DixitOverview from "../models/DixitOverview";
import Playground from "./Playground";

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
    const dixitConnectCallback = useCallback(() => {
        dixitService.getDixitOverview(dixitId, playerId)
            .then((dixitOverview) => {
                dixitOverview.players.sort((playerA, playerB) => playerA.score === playerB.score ? playerA.id.localeCompare(playerB.id) : playerB.score - playerA.score);
                dixitOverview.winners.sort((winnerA, winnerB) => winnerA.score === winnerB.score ? winnerA.id.localeCompare(winnerB.id) : winnerB.score - winnerA.score);
                setDixitOverview(dixitOverview);
            })
            .catch(() => dixitService.initializeDixit());
    }, [setDixitOverview, dixitId, playerId]);

    useEffect(() => {
        dixitService.dixitConnectCallback = dixitConnectCallback;
    }, [dixitConnectCallback]);

    return (
        <DixitContext.Provider value={dixitContext}>
            <div className="dixit">
                <PlayerBar/>
                <Playground/>
            </div>
        </DixitContext.Provider>
    );
}

export default Dixit;