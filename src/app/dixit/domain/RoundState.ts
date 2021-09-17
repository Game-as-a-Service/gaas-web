const STORY_TELLING: RoundState = 'story-telling';
const CARD_PLAYING: RoundState = 'card-playing';
const PLAYER_GUESSING: RoundState = 'player-guessing';
const SCORING: RoundState = 'scoring';
const ROUND_OVER: RoundState = 'over';

type States = 'story-telling' | 'card-playing' | 'player-guessing' | 'scoring' | 'over';
type RoundState = undefined | States;

export type {RoundState};
export {STORY_TELLING, CARD_PLAYING, PLAYER_GUESSING, SCORING, ROUND_OVER}
