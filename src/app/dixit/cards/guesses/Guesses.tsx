import './Guesses.scss';
import React from "react";
import Guess from "../../model/Guess";
import {RoundState, SCORING} from "../../model/RoundState";
import PlayCard from "../../model/PlayCard";
import Player from "../../model/Player";

interface GuessesProp {
    dixitState: RoundState;
    playCards: Array<PlayCard>;
    guesses: Array<Guess>;
}

const Guesses = ({dixitState, playCards, guesses}: GuessesProp) => {

    const Guess = ({playCard}: { playCard: PlayCard }) => {
        const guessers: Array<Player> = guesses.filter(guess => guess.playCard.equals(playCard))
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