import './Rank.scss';
import React, {useEffect, useState} from "react";
import Player from "../model/domain/Player";
import {GAME_OVER, GameState} from "../model/domain/GameState";
import {Subscription} from "rxjs";
import {dixitService} from "../services/services";
import DixitGameOverEvent from "../model/events/DixitGameOverEvent";

const Rank = () => {
    const [gameState, setGameState] = useState<GameState>(undefined);
    const [winners, setWinners] = useState<Player[]>([
        // new Player('1', 'player1', 'RED', 30),
        // new Player('2', 'player2', 'ORANGE', 22),
        // new Player('3', 'player3', 'YELLOW', 24),
        // new Player('4', 'player4', 'GREEN', 27),
        // new Player('5', 'player5', 'BLUE', 29),
        // new Player('6', 'player6', 'VIOLET', 25)
    ]);
    const subscriptions: Array<Subscription> = [];
    let dixitId: string = 'dixitId';
    let playerId: string = '1';

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