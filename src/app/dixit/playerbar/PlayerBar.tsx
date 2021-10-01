import './PlayerBar.scss';
import Logo from "../logo/Logo";
import Player from "../model/Player";
import React, {useEffect, useState} from "react";
import {Subscription} from "rxjs";
import {dixitService} from "../services/services";
import DixitGameStartedEvent from "../events/gamestate/DixitGameStartedEvent";
import DixitRoundOverEvent from "../events/roundstate/DixitRoundOverEvent";
import {useDixitContext} from "../Dixit";
import DixitContextProp from "../DixitContext";

const PlayerBar = () => {
    const {
        dixitId, playerId,
        // When GameState === STARTED，Then set players
        gameState, setGameState,
        // When RoundState === ROUND_OVER，Then reset players
        roundState, setRoundState
    }: DixitContextProp = useDixitContext() as DixitContextProp;
    const [players, setPlayers] = useState<Player[]>([]);
    const subscriptions: Array<Subscription> = [];

    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        subscriptions.push(dixitService.subscribeToDixitGameStartedEvent(dixitId, playerId, onDixitGameStarted));
        subscriptions.push(dixitService.subscribeToDixitRoundOverEvent(dixitId, playerId, onDixitRoundOver));
    }

    const onDixitGameStarted = (dixitGameStartedEvent: DixitGameStartedEvent) => {
        setGameState(dixitGameStartedEvent.gameState);
        setPlayers(dixitGameStartedEvent.players);
    }

    const onDixitRoundOver = (dixitRoundOverEvent: DixitRoundOverEvent) => {
        setRoundState(dixitRoundOverEvent.roundState);
        setPlayers(dixitRoundOverEvent.players);
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    useEffect(() => {
        // 訂略事件 WS
        // 初始遊戲資訊 API
    }, []);

    useEffect(() => {

    }, [gameState, setGameState]);

    useEffect(() => {

    }, [roundState, setRoundState]);

    const PlayerItem = ({player}: { player: Player }) => {
        return (
            <div className="player-item">
                <span className={player.color}>{player.score}</span>
                <span className="player-name">{player.name.substr(0, 7)}</span>
            </div>
        );
    }

    return <div className="player-bar">
        <div className="logo-bar">
            <Logo/>
        </div>
        {
            players.map(player => <PlayerItem player={player}/>)
        }
    </div>;
}

export default PlayerBar;
