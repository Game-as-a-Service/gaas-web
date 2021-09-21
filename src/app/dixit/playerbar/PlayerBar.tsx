import './PlayerBar.scss';
import Logo from "../logo/Logo";
import Player from "../model/domain/Player";
import {useEffect, useState} from "react";
import {RoundState} from "../model/domain/RoundState";
import {GameState} from "../model/domain/GameState";
import {Subscription} from "rxjs";
import {dixitService} from "../services/services";
import DixitGameStartedEvent from "../model/events/DixitGameStartedEvent";
import DixitRoundOverEvent from "../model/events/DixitRoundOverEvent";
import {useDixitContext} from "../Dixit";

const PlayerBar = () => {
    const {dixitId, playerId} = useDixitContext();
    // When GameState === STARTED，Then set players
    const [gameState, setGameState] = useState<GameState>(undefined);
    // When RoundState === ROUND_OVER，Then reset players
    const [roundState, setRoundState] = useState<RoundState>(undefined);
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

    const PlayerItem = (prop: { player: Player }) => {
        let player: Player = prop.player;
        return <div className="player-item">
            <span className={player.color}>{player.score}</span>
            <span className="player-name">{player.name.substr(0, 7)}</span>
        </div>;
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