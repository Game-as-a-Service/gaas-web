import './PlayerBar.scss';
import Logo from "../logo/Logo";
import Player from "../model/domain/Player";

interface PlayerBarProp {
    players: Player[];
}

interface PlayerItemProp {
    player: Player;
}

const PlayerBar = (prop: PlayerBarProp) => {
    const players = prop.players;

    const PlayerItem = (prop: PlayerItemProp) => {
        let player: Player = prop.player;
        return <div className="player-item">
            <span className={player.color}>{player.score}</span>
            <span className="player-name">{player.name}</span>
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