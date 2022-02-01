import './Lobby.scss';
import {FaDoorOpen} from 'react-icons/fa';
import {IoGameController} from 'react-icons/io5';
import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import roomService from "../service/RoomService";

interface EntranceBlockInfo {
    btnName: string,
    title: string,
    icon: React.ReactNode,
    onClick: any,
    backgroundColor: string,
    btnStyle: string
}

const EntranceBlock = ({btnName, title, icon, onClick, backgroundColor, btnStyle}: EntranceBlockInfo) => {
    const [passCode, setPassCode] = useState('');
    const [nickName, setNickName] = useState('');
    const [error, setError] = useState(false);

    const onClickBtn = (e: any) => {
        e.preventDefault();
        if (inputValidation(passCode) && inputValidation(nickName)) {
            onClick({passCode, nickName});
        } else {
            setError(true);
            console.log('invalidInput');
        }
    };

    const inputValidation = (value: string): boolean => {
        return value.length >= 8;
    };

    const passCodeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const passCode: string = e.target.value;
        setPassCode(passCode);
        setError(false);
    };

    const nickNameInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nickName: string = e.target.value;
        setNickName(nickName);
        setError(false);
    };

    return <form className='entrance-block' style={{backgroundColor}}>
        {icon}
        <p className='title'>{title}</p>
        <input className='input' type='text' onInput={passCodeInputHandler}
               placeholder='Enter PassCode' data-cy='passCodeInput'/>
        <input className='input' type='text' onInput={nickNameInputHandler}
               placeholder='Enter Your NickName' data-cy='nickNameInput'/>
        {error ? <p className='error-msg'> warning!! </p> : ''}
        <button className={`room-btn ${btnStyle}`} onClick={onClickBtn} data-cy='room-btn'>{btnName}</button>
    </form>;
};

interface ClickBtnProp {
    passCode: string,
    nickName: string
}

const Lobby = () => {
    const history = useHistory();

    const onCreateRoom = ({passCode, nickName}: ClickBtnProp) => {
        roomService.createRoom(passCode, nickName)
            .then(data => {
                console.log(data);
                localStorage.setItem('playerId', data.hostId);
                localStorage.setItem('passCode', passCode);
                history.push(
                    {
                        pathname: `/room/${data.roomId}`,
                    });
            });
    };

    const onJoinRoom = ({passCode, nickName}: ClickBtnProp) => {
        console.log(passCode, nickName);
        roomService.joinRoom(passCode, nickName)
            .then(data => {
                localStorage.setItem('playerId', data.playerId);
                localStorage.setItem('passCode', passCode);

                history.push({
                    pathname: `/room/${data.roomId}`,
                });
            });
    };

    return <div className='lobby'>
        <EntranceBlock btnName='Join Room'
                       title='Having Fun With Your Friends !'
                       icon={<FaDoorOpen className='entrance-icon' color='95A612' style={{marginRight: '3px'}}/>}
                       onClick={onJoinRoom}
                       backgroundColor='#353389'
                       btnStyle='join-room-btn'/>
        <EntranceBlock btnName='Create A Game Room'
                       title="Let's play a game!"
                       icon={<IoGameController className='entrance-icon' color='F2B749' style={{marginRight: '3px'}}/>}
                       onClick={onCreateRoom}
                       backgroundColor='#121062'
                       btnStyle='create-room-btn'/>
    </div>;
};

export {Lobby, EntranceBlock};
