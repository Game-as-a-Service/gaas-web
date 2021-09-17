import Player from "../domain/Player";
import './PlayerListItem.scss';

interface PlayerListItemProp {
    player: Player;
}

const PlayerListItem = (prop: PlayerListItemProp) => {
    let player: Player = prop.player;
    return (
        <div className="player-list-item">
            <span className={player.color}>{player.score}</span>
            <span className="player-name">{player.name}</span>
        </div>
    );
}
export default PlayerListItem;