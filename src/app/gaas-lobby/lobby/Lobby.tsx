import './Lobby.scss';
import {FaDoorOpen} from 'react-icons/fa';
import {IoGameController} from 'react-icons/io5';
import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {roomService} from "../service/RoomService";
import {GameRoom} from "../model/model";

const JoinRoomBlock = ({onJoinRoom}: { onJoinRoom: (passCode: string, nickName: string) => void }) => {
    const [passCode, setPassCode] = useState('');
    const [nickName, setNickName] = useState('');
    const [error, setError] = useState<{ passCodeError: boolean, nickNameError: boolean }>({
        passCodeError: false,
        nickNameError: false
    });

    const passCodeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const passCode: string = e.target.value;
        setPassCode(passCode);
        setError({...error, passCodeError: false});
    };

    const onClickBtn = (e: any) => {
        e.preventDefault();

        if (!passCodeValidation(passCode)) {
            setError({passCodeError: true, nickNameError: false});
            console.log('invalid PassCode');
        } else if (!nickNameValidation(nickName)) {
            setError({passCodeError: false, nickNameError: true});
            console.log('invalid NickName');
        } else {
            onJoinRoom(passCode, nickName);
        }
    };

    const passCodeValidation = (value: string): boolean => {
        return value.length === 36;
    };

    const nickNameValidation = (value: string): boolean => {
        return value.length > 0;
    };

    return <form className='entrance-block' style={{backgroundColor: '#353389'}}>
        <FaDoorOpen className='entrance-icon' color='95A612' style={{marginRight: '3px'}}/>
        <p className='title'>Having Fun With Your Friends !</p>
        <input className='input' type='text hidden' onChange={passCodeInputHandler}
               placeholder='Enter PassCode' data-cy='passCodeInput'/>
        <input className='input' type='text'
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickName(e.target.value)}
               placeholder='Enter Your NickName' data-cy='nickNameInput'/>
        {error.passCodeError ? <p className='error-msg'> Invalid PassCode!! </p> : ''}
        {error.nickNameError ? <p className='error-msg'> Invalid NickName!! </p> : ''}
        <button className='room-btn join-room-btn' onClick={onClickBtn} data-cy='room-btn'>Join Room</button>
    </form>;
};

const CreateRoomBlock = ({onCreateRoom}: { onCreateRoom: (nickName: string) => void }) => {
    const [nickName, setNickName] = useState('');
    const [errorNickName, setErrorNickName] = useState(false);

    const onClickBtn = (e: any) => {
        e.preventDefault();
        if (nickNameValidation(nickName)) {
            onCreateRoom(nickName);
        } else {
            setErrorNickName(true);
            console.log('invalid NickName');
        }
    };

    const nickNameValidation = (value: string): boolean => {
        return value.length > 0;
    };

    return <div className='entrance-block' style={{background: '#121062'}}>
        <IoGameController className='entrance-icon' color='F2B749' style={{marginRight: '3px'}}/>
        <p className='title'>Let's play a game!</p>
        <input className='input' type='text'
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickName(e.target.value)}
               placeholder='Enter Your NickName' data-cy='nickNameInput'/>
        {errorNickName ? <p className='error-msg'> Invalid NickName!! </p> : ''}
        <button className={`room-btn create-room-btn`} onClick={onClickBtn} data-cy='room-btn'>Create
            A Game Room
        </button>
    </div>;
}

const Lobby = () => {
    const history = useHistory<{ playerId: string, room: GameRoom }>();

    const onJoinRoom = (passCode: string, nickName: string) => {
        roomService.joinRoom(passCode, nickName)
            .then(({playerId, room}: { playerId: string, room: GameRoom }) => {
                history.push({pathname: `/rooms/${room.id}`, state: {playerId, room}});
            });
    };

    const onCreateRoom = (nickName: string) => {
        roomService.createRoom(nickName)
            .then(({playerId, room}: { playerId: string, room: GameRoom }) => {
                localStorage.setItem('playerId', playerId);
                history.push({pathname: `/rooms/${room.id}`, state: {playerId, room}});
            })
    };

    return <div className='lobby'>
        <JoinRoomBlock onJoinRoom={onJoinRoom}/>
        <CreateRoomBlock onCreateRoom={onCreateRoom}/>
    </div>;
};

export {Lobby};
