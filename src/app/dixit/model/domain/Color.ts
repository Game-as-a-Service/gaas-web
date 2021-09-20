const RED: Color = 'RED';
const ORANGE: Color = 'ORANGE';
const YELLOW: Color = 'YELLOW';
const GREEN: Color = 'GREEN';
const BLUE: Color = 'BLUE';
const VIOLET: Color = 'VIOLET';

type Colors = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE' | 'VIOLET';
type Color = undefined | Colors;

export type {Color};
export {RED, ORANGE, YELLOW, GREEN, BLUE, VIOLET};