import React from "react";
import Player from "../../models/model/Player";
import './ScoreBoard.scss';

const ScoreBoard = ({players}: { players: Array<Player> }) => {
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
                players.map((player, rank) => <ScoreBoardItem player={player} rank={rank}/>)
            }
            </tbody>
        </table>
    );
}

const ScoreBoardItem = ({player, rank}: { player: Player, rank: number }) => {
    return (
        <tr className={player.color}>
            <td>{(rank + 1)}</td>
            <td>{player.name}</td>
            <td>{player.score}</td>
        </tr>
    );
};


export default ScoreBoard;