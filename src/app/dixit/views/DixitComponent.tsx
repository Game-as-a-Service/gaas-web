import './DixitComponent.scss';
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import PlayerBarComponent from "./playerbar/PlayerBarComponent";
import DixitOverview from "../models/DixitOverview";
import PlaygroundComponent from "./playground/PlaygroundComponent";
import {useHistory, useParams} from "react-router-dom";
import {DixitService} from "../services/DixitService";
import {Game} from "../../gaas-lobby/model/model";

type DixitOverviewState = DixitOverview | ((prevDixitOverview: DixitOverview) => DixitOverview);

export interface DixitContextValue {
    dixitId: string,
    playerId: string,
    dixitOverview: DixitOverview,
    setDixitOverview: (dixitOverviewState: DixitOverviewState) => void
}

export const DixitContext = createContext<DixitContextValue>({
    dixitId: '',
    playerId: '',
    dixitOverview: DixitOverview.defaultDixitOverview,
    setDixitOverview: () => void {}
});

export const useDixitContext = () => {
    return useContext(DixitContext);
};

const DixitComponent = () => {
    const {gameId} = useParams<{ gameId: string }>();
    const history = useHistory<{ playerId: string, game: Game }>();
    const playerId: string = history.location.state.playerId;
    const game: Game = history.location.state.game;
    const [dixitOverview, setDixitOverview] = useState<DixitOverview>(DixitOverview.defaultDixitOverview);
    const dixitService: DixitService = useMemo<DixitService>(() => new DixitService(game.serviceHost), [game.serviceHost]);

    const getDixitOverview = useCallback(() => {
        dixitService.getDixitOverview(gameId, playerId)
            .then((dixitOverview) => {
                dixitOverview.players.sort((playerA, playerB) => playerA.score === playerB.score ? playerA.id.localeCompare(playerB.id) : playerB.score - playerA.score);
                dixitOverview.winners.sort((winnerA, winnerB) => winnerA.score === winnerB.score ? winnerA.id.localeCompare(winnerB.id) : winnerB.score - winnerA.score);
                setDixitOverview(dixitOverview);
            })
            .catch(() => dixitService.initializeDixit());
    }, [dixitService, gameId, playerId]);

    useEffect(() => {
        if (dixitOverview === DixitOverview.defaultDixitOverview) {
            getDixitOverview();
        }
    }, [dixitOverview, getDixitOverview]);

    useEffect(() => {
        dixitService.dixitConnectCallback = getDixitOverview;
    }, [dixitService, getDixitOverview]);

    return (
        <DixitContext.Provider value={{dixitId: gameId, playerId, dixitOverview, setDixitOverview}}>
            <div className="playground-position">
                <PlaygroundComponent dixitService={dixitService}/>
            </div>
            <div className="player-bar-position">
                <PlayerBarComponent/>
            </div>
        </DixitContext.Provider>
    );
}

export default DixitComponent;