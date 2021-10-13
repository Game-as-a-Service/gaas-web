import {GameState, PREPARING} from "./model/GameState";
import {RoundState} from "./model/RoundState";
import Player from "./model/Player";
import Card from "./model/Card";
import Story from "./model/Story";
import PlayCard from "./model/PlayCard";
import Guess from "./model/Guess";

export default class DixitOverview {
    public static readonly defaultDixitOverview: DixitOverview = new DixitOverview({
        gameState: PREPARING,
        roundState: undefined,
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
    public players: Player[];
    public storyteller?: Player;
    public handCards: Card[];
    public story?: Story;
    public playCards: PlayCard[];
    public guesses: Guess[];
    public winners: Player[];

    constructor({gameState, roundState, rounds, players, storyteller, handCards, story, playCards, guesses, winners}:
                    {
                        gameState: GameState, roundState: RoundState, rounds: number, players: Player[],
                        storyteller?: Player, handCards: Card[],
                        story?: Story, playCards: PlayCard[], guesses: Guess[], winners: Player[]
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