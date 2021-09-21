import './Rank.scss';
import React, {useEffect, useState} from "react";
import Player from "../model/domain/Player";
import {GAME_OVER, GameState} from "../model/domain/GameState";
import {Subscription} from "rxjs";
import {dixitService} from "../services/services";
import DixitGameOverEvent from "../model/events/DixitGameOverEvent";
import {useDixitContext} from "../Dixit";

const Rank = () => {
    const {dixitId, playerId} = useDixitContext();
    const [gameState, setGameState] = useState<GameState>(undefined);
    const [winners, setWinners] = useState<Player[]>([]);
    const subscriptions: Array<Subscription> = [];

    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        subscriptions.push(dixitService.subscribeToDixitGameOverEvent(dixitId, playerId, onDixitGameOver));
    }

    const onDixitGameOver = (dixitGameOverEvent: DixitGameOverEvent) => {
        setGameState(dixitGameOverEvent.gameState);
        setWinners(dixitGameOverEvent.winners);
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const ScoreBoard = () => {
        let rank: number = 1;
        return <table className="dixit-score-board">
            <thead>
            <tr style={{backgroundColor: "#CFC5A5"}}>
                <th>名次</th>
                <th>玩家</th>
                <th>分數</th>
            </tr>
            </thead>
            <tbody>
            {
                winners.map(winner =>
                    <tr className={winner.color}>
                        <td>{rank++}</td>
                        <td>{winner.name}</td>
                        <td>{winner.score}</td>
                    </tr>
                )
            }
            </tbody>
        </table>;
    }

    const isGameOver: boolean = GAME_OVER === gameState;
    if (isGameOver) {
        return <ScoreBoard/>
    }
    return <></>
}

export default Rank;