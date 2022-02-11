import './Lobby.scss';
import { FaDoorOpen } from 'react-icons/fa';
import { IoGameController } from 'react-icons/io5';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import roomService from "../service/RoomService";

const CreateRoomBlock = ({onClick}: {onClick: any}) => {
   const [nickName, setNickName] = useState('');

   return <div className='entrance-block' style={{background: '#121062'}}>
      <IoGameController className='entrance-icon' color='F2B749' style={{marginRight: '3px'}}/>
      <p className='title'>Let's play a game!</p>
      <input className='input' type='text'
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickName(e.target.value)}
             placeholder='Enter Your NickName' data-cy='nickNameInput'/>
      <button className={`room-btn create-room-btn`} onClick={() => onClick(nickName)} data-cy='room-btn'>Create A Game Room</button>
   </div>;
}

const JoinRoomBlock = ({onClick}: {onClick: any}) => {
   const [passCode, setPassCode] = useState('');
   const [nickName, setNickName] = useState('');
   const [error, setError] = useState(false);

   const onClickBtn = (e: any) => {
      e.preventDefault();
      if (passCodeValidation(passCode)) {
         onClick(passCode, nickName);
      } else {
         setError(true);
         console.log('invalidInput');
      }
   };

   const passCodeValidation = (value: string): boolean => {
      return value.length == 36;
   };

   const passCodeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const passCode: string = e.target.value;
      setPassCode(passCode);
      setError(false);
   };

   return <form className='entrance-block' style={{backgroundColor: '#353389'}}>
      <FaDoorOpen className='entrance-icon' color='95A612' style={{marginRight: '3px'}}/>
      <p className='title'>Having Fun With Your Friends !</p>
      <input className='input' type='text hidden' onChange={passCodeInputHandler}
             placeholder='Enter PassCode' data-cy='passCodeInput'/>
      <input className='input' type='text'
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickName(e.target.value)}
             placeholder='Enter Your NickName' data-cy='nickNameInput'/>
      {error ? <p className='error-msg'> Invalid PassCode!! </p> : ''}
      <button className={`room-btn join-room-btn`} onClick={onClickBtn} data-cy='room-btn'>Join Room</button>
   </form>;
};

const Lobby = () => {
   const history = useHistory();

   const onCreateRoom = (nickName: string) => {
      roomService.createRoom(nickName)
         .then(data => {
            console.log(data);
            localStorage.setItem('playerId', data.playerId);
            history.push({pathname: `/rooms/${data.room.id}`});
         })
         .catch(() => {console.log("fail")});
   };

   const onJoinRoom = (passCode: string, nickName: string) => {
      console.log(passCode, nickName);
      roomService.joinRoom(passCode, nickName)
         .then(data => {
            localStorage.setItem('playerId', data.playerId);
            history.push({pathname: `/rooms/${data.room.id}`});
         });
   };

   return <div className='lobby'>
      <JoinRoomBlock onClick={onJoinRoom}/>
      <CreateRoomBlock onClick={onCreateRoom}/>
   </div>;
};

export { Lobby };
