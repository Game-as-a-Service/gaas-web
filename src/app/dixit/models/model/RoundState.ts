const STORY_TELLING: RoundState = 'STORY_TELLING';
const CARD_PLAYING: RoundState = 'CARD_PLAYING';
const PLAYER_GUESSING: RoundState = 'PLAYER_GUESSING';
const SCORING: RoundState = 'SCORING';
const ROUND_OVER: RoundState = 'OVER';

type States = 'STORY_TELLING' | 'CARD_PLAYING' | 'PLAYER_GUESSING' | 'SCORING' | 'OVER';
type RoundState = undefined | States;

export type {RoundState};
export {STORY_TELLING, CARD_PLAYING, PLAYER_GUESSING, SCORING, ROUND_OVER}
