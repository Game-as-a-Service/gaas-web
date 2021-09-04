import Player from "../domain/Player";
import './PlayerListItem.scss';

const PlayerListItem = (player: Player) => {
    return (
        <div className="player-list-item">
            <span className={player.color}>{player.score}</span>
            <span className="player-name">{player.name}</span>
        </div>
    );
}
export default PlayerListItem;