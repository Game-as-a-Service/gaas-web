import './Room.scss';
import {IoGameController} from 'react-icons/io5';
import {RiVipCrownFill} from 'react-icons/ri';
import {BsCheckLg, BsPersonFill} from 'react-icons/bs';
import {useCallback, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Game, GameRoom, Player} from '../model/model';
import roomService from "../service/RoomService";
import {ensure} from "../utils/utils";

const PlayerTag = ({name, host, ready}: Player) => {
    return <div className="player-tag">
        {host ? <RiVipCrownFill color="F2B749" style={{marginRight: '3px'}}/> : ''}
        <span>{name}</span>
        {ready ? <BsCheckLg color="CAE01F" style={{marginLeft: '3px'}}/> : ''}
    </div>;
};

const ChatMessage = ({playerName, message}: Message) => {
    return <div className="chat-message">
        <p className="chat-player-name">{playerName}: </p>
        <p className="chat-message-content">{message}</p>
    </div>;
};

interface Message {
    playerName: string,
    message: string
}

const Room = () => {
    const history = useHistory();
    const {roomId} = useParams<{ roomId: string }>();
    const playerId = localStorage.getItem('playerId');
    const [ready, setReady] = useState(false);
    const [host, setHost] = useState(false);
    const [room, setRoom] = useState<undefined | GameRoom>(undefined);
    const [game, setGame] = useState<undefined | Game>(undefined);

    const fetchRoom = useCallback(() => {
        roomService.getRoom(roomId)
            .then(room => {
                setRoom(room);
                setReady(ensure(room.players.find(p => playerId === p.id)).ready);
                if (room.hostId === playerId) {
                    setHost(room.hostId === playerId);
                }
            })
            .catch(() => console.log(`${roomId} Not Found`));
    }, [playerId, roomId]);

    useEffect(() => {
        if (!room) {
            fetchRoom();
        }
    });

    const onLeaveRoom = () => {
        history.goBack();
    };

    const onReady = () => {
        const player = ensure(room?.players.find((p: Player) => playerId === p.id));
        player.ready = !ready;
        roomService.ready(roomId, player)
            .then(() => setReady(!ready))
            .catch(err => console.log(err));
    };

    const onStartGame = () => {
        const gameId : string = '2';
        roomService.startGame(roomId, playerId, gameId)
            .then(setGame)
            .then(() => {
                history.push({
                    pathname: `/${game?.name}/${gameId}`,
                });
            });
    };

    return <>
        <div className="passcode-banner">
            <div className="passcode">PassCode</div>
            <div className="passcode-content">{localStorage.getItem('passCode')}</div>
        </div>

        <div className="room-space columns">
            <div className="play-ground column">
                <div className="next-game">
                    <div className="next-game-is"><IoGameController color={'#F2B749'} style={{marginRight: '10px'}}/>
                        Next Game is ...
                    </div>
                    <div className="next-game-name">
                        {game ? game.name : 'Online 1A2B Game'}
                    </div>
                </div>
                <div className="player-list">
                    {room?.players.map((p: Player) =>
                        <PlayerTag key={p.id} name={p.name} host={p.host} ready={p.ready} id={''}/>)}
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
                <ChatMessage playerName={'Player-One'} message="Hi, Let's play online 1A2B Game"/>
                <ChatMessage playerName={'Player-One'} message="Hi, Let's play online 1A2B Game"/>
                <ChatMessage playerName={'Player-One'} message="Hi, Let's play online 1A2B Game"/>
            </div>
        </div>
    </>;
};

export {Room, PlayerTag};
