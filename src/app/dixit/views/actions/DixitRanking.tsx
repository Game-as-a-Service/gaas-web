import './Rank.scss';
import React, {useEffect} from "react";
import Player from "../../models/model/Player";
import {GAME_OVER} from "../../models/model/GameState";
import {Subscription} from "rxjs";
import {dixitService} from "../../models/services/services";
import DixitGameOverEvent from "../../models/events/gamestate/DixitGameOverEvent";
import {DixitContextValue, useDixitContext} from "../Dixit";
import Event from "../../models/events/Event";

const DixitRanking = () => {
    const {dixitId, playerId, dixitOverview, setDixitOverview}: DixitContextValue = useDixitContext();
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

    const onDixitGameOver = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitGameOverEvent) {
                const dixitGameOverEvent: DixitGameOverEvent = event as DixitGameOverEvent;
                setDixitOverview({
                    ...dixitOverview,
                    gameState: dixitGameOverEvent.gameState,
                    winners: dixitGameOverEvent.winners
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const ScoreBoard = () => {
        return (
            <table className="dixit-score-board">
                <thead>
                <tr style={{backgroundColor: "#CFC5A5"}}>
                    <th>名次</th>
                    <th>玩家</th>
                    <th>分數</th>
                </tr>
                </thead>
                <tbody>
                {
                    dixitOverview.winners.map((winner, rank) => <ScoreBoardItem winner={winner} rank={rank}/>)
                }
                </tbody>
            </table>
        );
    }

    const ScoreBoardItem = ({winner, rank}: { winner: Player, rank: number }) => {
        return (
            <tr className={winner.color}>
                <td>{(rank + 1)}</td>
                <td>{winner.name}</td>
                <td>{winner.score}</td>
            </tr>
        );
    };

    const isGameOver: boolean = GAME_OVER === dixitOverview.gameState;
    if (isGameOver) {
        return <ScoreBoard/>;
    }
    return <></>;
}

export default DixitRanking;