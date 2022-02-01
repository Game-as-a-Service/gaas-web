import {GameState, PREPARING} from "./model/GameState";
import {NONE, RoundState} from "./model/RoundState";
import Player from "./model/Player";
import Card from "./model/Card";
import Story from "./model/Story";
import PlayCard from "./model/PlayCard";
import Guess from "./model/Guess";

export default class DixitOverview {
    public static readonly defaultDixitOverview: DixitOverview = new DixitOverview({
        gameState: PREPARING,
        roundState: NONE,
        rounds: 0,
        players: [],
        storyteller: undefined,
        handCards: [],
        story: undefined,
        playCards: [],
        guesses: [],
        winners: []
    });
    public gameState: GameState;
    public roundState: RoundState;
    public rounds: number;
    public players: Array<Player>;
    public storyteller?: Player;
    public handCards: Array<Card>;
    public story?: Story;
    public playCards: Array<PlayCard>;
    public guesses: Array<Guess>;
    public winners: Array<Player>;

    constructor({gameState, roundState, rounds, players, storyteller, handCards, story, playCards, guesses, winners}:
                    {
                        gameState: GameState, roundState: RoundState, rounds: number, players: Array<Player>,
                        storyteller?: Player, handCards: Array<Card>
                        story?: Story, playCards: Array<PlayCard>, guesses: Array<Guess>, winners: Array<Player>
                    }) {
        this.gameState = gameState;
        this.roundState = roundState;
        this.rounds = rounds;
        this.players = players;
        this.storyteller = storyteller;
        this.handCards = handCards;
        this.story = story;
        this.playCards = playCards;
        this.guesses = guesses;
        this.winners = winners;
    }
}