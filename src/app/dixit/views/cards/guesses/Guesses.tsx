import './Guesses.scss';
import React from "react";
import Guess from "../../../models/model/Guess";
import {RoundState, SCORING} from "../../../models/model/RoundState";
import PlayCard from "../../../models/model/PlayCard";
import Player from "../../../models/model/Player";
import Card from "../../../models/model/Card";

interface GuessesProp {
    dixitState: RoundState;
    playCards: Array<PlayCard>;
    guesses: Array<Guess>;
}

const playCardEquals = (playCard: PlayCard, guessPlayCard: PlayCard): boolean => {
    if (playCard && guessPlayCard) {
        return playerEquals(playCard.player, guessPlayCard.player) && cardEquals(playCard.card, guessPlayCard.card);
    }
    return false;
}

const playerEquals = (player: Player, guessPlayer: Player): boolean => {
    if (player && guessPlayer) {
        return player.id === guessPlayer.id && player.name === guessPlayer.name;
    }
    return false;
}

const cardEquals = (card: Card, guessCard: Card): boolean => {
    if (card && guessCard) {
        return card.id === guessCard.id;
    }
    return false;
}

const Guesses = ({dixitState, playCards, guesses}: GuessesProp) => {

    const Guess = ({playCard}: { playCard: PlayCard }) => {
        const guessers: Array<Player> = guesses.filter(guess => playCardEquals(playCard, guess.playCard))
            .map(guess => guess.guesser);

        const isGuessersEmpty = guessers.length === 0;

        return (
            <div className="dixit-guess-zone">
                <img className={playCard.player.color} alt="card"
                     src={`data:image/png;base64, ${playCard.card.image}`}/>
                {
                    isGuessersEmpty ? <></> : guessers.map(guesser =>
                        <p className={guesser.color}
                           style={{
                               width: "140px", height: "30px",
                               textAlign: "center", fontSize: "20px", fontWeight: "bold",
                               background: "#403F48", color: "#95A792", marginTop: "10px"
                           }}>{guesser.name}
                        </p>)
                }
            </div>
        );
    }

    const isScoring: boolean = SCORING === dixitState;
    const isGuessesEmpty = guesses.length === 0;
    if (isScoring && !isGuessesEmpty) {
        return (
            <div className="dixit-guesses">
                {
                    playCards.map(playCard => <Guess playCard={playCard}/>)
                }
            </div>
        );
    }
    return <></>
}

export default Guesses;