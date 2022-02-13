import './PlayerBarComponent.scss';
import LogoComponent from "../logo/LogoComponent";
import Player from "../../models/model/Player";
import React from "react";
import {DixitContextValue, useDixitContext} from "../DixitComponent";

const PlayerBarComponent = () => {
    const {dixitOverview}: DixitContextValue = useDixitContext();

    const PlayerItem = ({player}: { player: Player }) => {
        return (
            <div key={player.id} className="player-item">
                <span className={player.color}>{player.score}</span>
                <span className="player-name">{player.name.substr(0, 7)}</span>
            </div>
        );
    }

    return (
        <div className="player-bar">
            <div className="logo-position">
                <LogoComponent/>
            </div>
            {
                dixitOverview.players.map(player => <PlayerItem player={player}/>)
            }
        </div>
    );
}

export default PlayerBarComponent;
