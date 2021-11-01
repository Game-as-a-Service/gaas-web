import { EntranceBlock } from './Lobby';
import { fireEvent, render } from '@testing-library/react';
import { FaDoorOpen } from 'react-icons/fa';
import '@testing-library/jest-dom';

const Entrance = () => {
	return <EntranceBlock btnName='Join Room'
		title='Having Fun With Your Friends !'
		icon={<FaDoorOpen className='entrance-icon' color='95A612' style={{marginRight: '3px'}}/>}
		onClick={() => console.log('jest-test')}
		backgroundColor='#353389'
		btnStyle='join-room-btn'/>;
};

const setup = () => {
	const entranceBlock = render(<Entrance />);
	const passCodeInput = (entranceBlock.getByPlaceholderText('Enter PassCode') as HTMLInputElement);
	const nickNameInput = (entranceBlock.getByPlaceholderText('Enter Your NickName') as HTMLInputElement);
	const button = entranceBlock.getByRole('button');

	return { passCodeInput, nickNameInput, button, entranceBlock };
};

describe('<EntranceBlock/>', () => {

	test('the initial form should be empty', async () => {
		const { passCodeInput } = setup();
		expect(passCodeInput).toBeInTheDocument();
		expect(passCodeInput.value).toBe('');
	});

	test('passCode input test', async () => {
		const { passCodeInput } = setup();
		fireEvent.input(passCodeInput, {target: {value: 'passCode'}});
		expect(passCodeInput.value).toBe('passCode');
	});

	test('the length of passCode & nickname should over 8', async () => {
		const { passCodeInput, nickNameInput, button, entranceBlock } = setup();

		fireEvent.input(passCodeInput, {target: {value: 'passCode'}});
		fireEvent.input(nickNameInput, {target: {value: 'nick'}});
		fireEvent.click(button);
		const warningMsg = entranceBlock.getByText(/warning!!/i);
		expect(warningMsg).toBeInTheDocument();
	});
});
