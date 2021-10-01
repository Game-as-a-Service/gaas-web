import {GameState} from "./model/GameState";
import {RoundState} from "./model/RoundState";
import Card from "./model/Card";
import Story from "./model/Story";
import PlayCard from "./model/PlayCard";
import Guess from "./model/Guess";
import Player from "./model/Player";

export default interface DixitContextProp {
    dixitId: string,
    setDixitId: (dixitId: string) => void,

    playerId: string,
    setPlayerId: (playerId: string) => void,

    rounds: number,
    setRounds: (rounds: number) => void,

    gameState: GameState,
    setGameState: (gameState: GameState) => void,

    roundState: RoundState,
    setRoundState: (roundState: RoundState) => void,

    handCards: Array<Card>,
    setHandCards: (handCards: Array<Card>) => void,

    story: Story | undefined,
    setStory: (story: Story) => void,

    playCards: Array<PlayCard>,
    setPlayCards: (playCards: Array<PlayCard>) => void,

    guesses: Array<Guess>,
    setGuesses: (guesses: Array<Guess>) => void
}