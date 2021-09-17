import './PlayerBar.scss';
import Logo from "../logo/Logo";
import Player from "../domain/Player";
import PlayerListItem from "./PlayerListItem";

interface PlayerBarProp {
    players: Player[];
}

const PlayerBar = (prop: PlayerBarProp) => {
    const players = prop.players;
    return (
        <div className="player-bar">
            <div className="logo-bar">
                <Logo/>
            </div>
            <div className="player-list">
                {
                    players.map(player => <PlayerListItem player={player}/>)
                }
            </div>
        </div>
    );
}

export default PlayerBar;