const NONE: RoundState = 'NONE';
const STORY_TELLING: RoundState = 'STORY_TELLING';
const CARD_PLAYING: RoundState = 'CARD_PLAYING';
const STORY_GUESSING: RoundState = 'STORY_GUESSING';
const SCORING: RoundState = 'SCORING';

type RoundState = 'NONE' | 'STORY_TELLING' | 'CARD_PLAYING' | 'STORY_GUESSING' | 'SCORING';

export type {RoundState};
export {NONE, STORY_TELLING, CARD_PLAYING, STORY_GUESSING, SCORING}
