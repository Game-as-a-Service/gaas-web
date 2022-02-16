import './Room.scss';
import {IoGameController} from 'react-icons/io5';
import {RiVipCrownFill} from 'react-icons/ri';
import {BsCheckLg, BsPersonFill} from 'react-icons/bs';
import {useCallback, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Game, GameRoom, Player} from '../model/model';
import {Option, roomService} from "../service/RoomService";
import {ensure} from "../utils/utils";
import {GameStartedEvent, RoomPlayerJoinedEvent, RoomPlayerLeftEvent, RoomPlayerReadiedEvent} from "../model/events";

const PlayerTag = ({player}: { player: Player }) => {
    return <div className="player-tag">
        {player.host ? <RiVipCrownFill color="F2B749" style={{marginRight: '3px'}}/> : ''}
        <span>{player.name}</span>
        {player.ready ? <BsCheckLg color="CAE01F" style={{marginLeft: '3px'}}/> : ''}
    </div>;
};

interface Message {
    playerName: string,
    message: string
}

const ChatMessage = ({playerName, message}: Message) => {
    return <div className="chat-message">
        <p className="chat-player-name">{playerName}: </p>
        <p className="chat-message-content">{message}</p>
    </div>;
};

const Room = () => {
    const history = useHistory<{ playerId: string, room: GameRoom } | { playerId: string, game: Game }>();
    const {roomId} = useParams<{ roomId: string }>();
    const playerId = history.location.state.playerId;
    const [ready, setReady] = useState(false);
    const [host, setHost] = useState(false);
    const [room, setRoom] = useState<undefined | GameRoom>();

    const fetchRoom = useCallback(() => {
        roomService.getRoom(roomId)
            .then(room => {
                setRoom(room);
                setReady(ensure(room.players.find(p => playerId === p.id)).ready);
                setHost(room.hostId === playerId);
            })
            .catch(() => console.log(`${roomId} Not Found`));
    }, [playerId, roomId]);

    useEffect(() => {
        if (!room) {
            fetchRoom();
        }
    });

    const onLeaveRoom = () => {
        roomService.leaveRoom(roomId, playerId)
            .then(() => history.goBack());
    };

    const onReady = () => {
        roomService.ready(roomId, playerId, !ready)
            .then(() => setReady(!ready))
            .catch(err => console.log(err));
    };

    const onStartGame = () => {
        if (host) {
            const options = [new Option('winningScore', 30)];
            roomService.startGame(roomId, playerId, options)
                .then(({gameId, gameName, gameServiceHost}) => history.push({
                    pathname: `../../${gameName}/${gameId}`,
                    state: {playerId, game: new Game(gameId, gameName, gameServiceHost)}
                }));
        }
    };

    const subscribeEvents = useCallback(() => {
        roomService.subscribeToRoomPlayerJoinedEvent(roomId, {
            handleEvent: ({player}: RoomPlayerJoinedEvent) => {
                if (playerId !== player.id) {
                    setRoom(room => {
                        if (room && !room.players.find(p => p.id === player.id)) {
                            return {...room, players: [...room.players, player]};
                        }
                        return room;
                    });
                }
            }
        });

        roomService.subscribeToRoomPlayerLeftEvent(roomId, {
            handleEvent: ({player}: RoomPlayerLeftEvent) => {
                if (playerId === player.id) {
                    history.goBack();
                } else {
                    setRoom(room => {
                        if (room && room.players.find(p => p.id === player.id)) {
                            return {...room, players: room.players.filter(p => p.id !== player.id)};
                        }
                        return room;
                    });
                }
            }
        });

        roomService.subscribeToRoomPlayerReadiedEvent(roomId, {
            handleEvent: ({player}: RoomPlayerReadiedEvent) => {
                if (playerId !== player.id) {
                    setRoom(room => {
                        if (room) {
                            const playerIndex = room.players.findIndex(p => p.id === player.id);
                            room.players[playerIndex] = player;
                            return {...room};
                        }
                        return room;
                    });
                }
            }
        });

        roomService.subscribeToGameStartedEvent(roomId, {
            handleEvent({gameId, gameName, gameServiceHost}: GameStartedEvent): void {
                if (!host) {
                    history.push({
                        pathname: `../../${gameName}/${gameId}`,
                        state: {
                            playerId,
                            game: new Game(gameId, gameName, gameServiceHost)
                        }
                    });
                }
            }
        });
    }, [history, playerId, roomId]);

    const unsubscribeEvents = useCallback(() => {
        roomService.clearSubscriptions();
    }, []);

    useEffect(() => {
        subscribeEvents();
        return () => {
            unsubscribeEvents();
        };
    }, [subscribeEvents, unsubscribeEvents]);

    return <>
        <div className="passcode-banner">
            <div className="passcode">PassCode</div>
            <div className="passcode-content">{room?.passCode}</div>
        </div>

        <div className="room-space columns">
            <div className="play-ground column">
                <div className="next-game">
                    <div className="next-game-is"><IoGameController color={'#F2B749'} style={{marginRight: '10px'}}/>
                        Next Game is ...
                    </div>
                    <div className="next-game-name">
                        {room?.game ? room?.game.name : 'Online Dixit Game'}
                    </div>
                </div>
                <div className="player-list">
                    {room?.players.map((p: Player) => <PlayerTag player={p}/>)}
                </div>
                <div className="align-bottom">
                    <button className="room-btn" onClick={onLeaveRoom}>Leave</button>
                    <button className="room-btn" onClick={onReady}>
                        {ready ? 'Cancel ready' : 'Get Ready'}
                    </button>
                    {host ? <>
                        <button className="room-btn">Select Game</button>
                        <button className="room-btn" onClick={onStartGame}>Start Game</button>
                    </> : ''}
                    <div className="number-of-players"><BsPersonFill color="000000" style={{marginRight: '5px'}}/>
                        {room?.players.length}
                    </div>
                </div>
            </div>

            <div className="column is-one-fifth chat-box">
                <p className="chat-box-title">Chat Box</p>
                {
                    room?.players.map(player => <ChatMessage playerName={player.name}
                                                             message="Hi, Let's play online Dixit Game"/>)
                }
            </div>
        </div>
    </>;
};

export {Room, PlayerTag};
