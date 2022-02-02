const PREPARING: GameState = 'PREPARING';
const STARTED: GameState = 'STARTED';
const OVER: GameState = 'OVER';

type States = 'PREPARING' | 'STARTED' | 'OVER';
type GameState = undefined | States;

export type {GameState};
export {PREPARING, STARTED, OVER};