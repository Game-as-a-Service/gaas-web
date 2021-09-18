const RED: Color = 'red';
const ORANGE: Color = 'orange';
const YELLOW: Color = 'yellow';
const GREEN: Color = 'green';
const BLUE: Color = 'blue';
const VIOLET: Color = 'violet';

type Colors = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'violet';
type Color = undefined | Colors;

export type {Color};
export {RED, ORANGE, YELLOW, GREEN, BLUE, VIOLET};