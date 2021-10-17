import './PlayerBar.scss';
import Logo from "../logo/Logo";
import Player from "../../models/model/Player";
import React, {useEffect} from "react";
import {dixitService} from "../../models/services/services";
import {DixitContextValue, useDixitContext} from "../Dixit";
import Event from "../../models/events/Event";
import DixitGameStartedEvent from "../../models/events/gamestate/DixitGameStartedEvent";
import DixitOverview from "../../models/DixitOverview";

const PlayerBar = () => {
    const {dixitId, playerId, dixitOverview, setDixitOverview}: DixitContextValue = useDixitContext();

    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        dixitService.subscribeToDixitGameStartedEvent(dixitId, playerId, onDixitGameStarted);
    }

    const onDixitGameStarted = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitGameStartedEvent) {
                const dixitGameStartedEvent: DixitGameStartedEvent = event as DixitGameStartedEvent;
                setDixitOverview((dixitOverview: DixitOverview) => {
                    return {
                        ...dixitOverview,
                        gameState: dixitGameStartedEvent.gameState,
                        players: dixitGameStartedEvent.players
                    };
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const unsubscribeEvents = () => {
        dixitService.clearSubscriptions();
    }

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
            <div className="logo-bar">
                <Logo/>
            </div>
            {
                dixitOverview.players.map(player => <PlayerItem player={player}/>)
            }
        </div>
    );
}

export default PlayerBar;
