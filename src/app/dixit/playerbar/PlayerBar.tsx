import './PlayerBar.scss';
import Logo from "../logo/Logo";
import {useState} from "react";
import Player from "../domain/Player";
import PlayerListItem from "./PlayerListItem";

const PlayerBar = () => {
    const [players, setPlayers] = useState<Player[]>([
        new Player(1, 'player1', 'red', 30),
        new Player(2, 'player2', 'orange', 22),
        new Player(3, 'player3', 'yellow', 24),
        new Player(4, 'player4', 'green', 27),
        new Player(5, 'player5', 'blue', 29),
        new Player(6, 'player6', 'violet', 25)
    ]);
    return (
        <div className="player-bar">
            <div className="logo-bar">
                <Logo/>
            </div>
            <div className="player-list">
                {
                    players.map(player => {
                        return <PlayerListItem id={player.id} name={player.name}
                                               color={player.color} score={player.score}/>
                    })
                }
            </div>
        </div>
    );
}

export default PlayerBar;