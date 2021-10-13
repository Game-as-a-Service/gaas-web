import './PlayerBar.scss';
import Logo from "../logo/Logo";
import Player from "../../models/model/Player";
import React, {useEffect} from "react";
import {Subscription} from "rxjs";
import {dixitService} from "../../models/services/services";
import DixitRoundOverEvent from "../../models/events/roundstate/DixitRoundOverEvent";
import {DixitContextValue, useDixitContext} from "../Dixit";
import Event from "../../models/events/Event";
import DixitGameStartedEvent from "../../models/events/gamestate/DixitGameStartedEvent";

const PlayerBar = () => {
    const {dixitId, playerId, dixitOverview, setDixitOverview}: DixitContextValue = useDixitContext();
    const subscriptions: Array<Subscription> = [];

    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, []);

    const subscribeEvents = () => {
        subscriptions.push(dixitService.subscribeToDixitGameStartedEvent(dixitId, playerId, onDixitGameStarted));
        subscriptions.push(dixitService.subscribeToDixitRoundOverEvent(dixitId, playerId, onDixitRoundOver));
    }

    const onDixitGameStarted = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitGameStartedEvent) {
                const dixitGameStartedEvent: DixitGameStartedEvent = event as DixitGameStartedEvent;
                setDixitOverview({
                    ...dixitOverview,
                    gameState: dixitGameStartedEvent.gameState,
                    players: dixitGameStartedEvent.players
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const onDixitRoundOver = {
        handleEvent: (event: Event) => {
            if (event instanceof DixitRoundOverEvent) {
                const dixitRoundOverEvent: DixitRoundOverEvent = event as DixitRoundOverEvent;
                setDixitOverview({
                    ...dixitOverview,
                    roundState: dixitRoundOverEvent.roundState,
                    rounds: dixitRoundOverEvent.rounds,
                    players: dixitRoundOverEvent.players
                });
                dixitService.onEventHandled(event);
            }
        }
    }

    const unsubscribeEvents = () => {
        subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    const PlayerItem = ({player}: { player: Player }) => {
        return (
            <div className="player-item">
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
