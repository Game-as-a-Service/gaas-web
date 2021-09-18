import './Rank.scss';
import React, {useState} from "react";
import Player from "../model/domain/Player";
import {GAME_OVER, GameState} from "../model/domain/GameState";

const Rank = () => {
    const [isShowEvent, setIsShowEvent] = useState<boolean>(true);
    const [gameState, setGameState] = useState<GameState>(undefined);
    const [winners, setWinners] = useState<Player[]>([
        new Player('1', 'player1', 'red', 30),
        new Player('2', 'player2', 'orange', 22),
        new Player('3', 'player3', 'yellow', 24),
        new Player('4', 'player4', 'green', 27),
        new Player('5', 'player5', 'blue', 29),
        new Player('6', 'player6', 'violet', 25)
    ]);

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