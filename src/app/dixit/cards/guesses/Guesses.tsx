import './Guesses.scss';
import Story from "../../model/domain/Story";
import React from "react";
import Guess from "../../model/domain/Guess";
import {RoundState, SCORING} from "../../model/domain/RoundState";
import PlayCard from "../../model/domain/PlayCard";
import Player from "../../model/domain/Player";

interface GuessesProp {
    dixitState: RoundState;
    story?: Story;
    playCards: Array<PlayCard>;
    guesses: Array<Guess>;
}

const Guesses = (prop: GuessesProp) => {
    const dixitState: RoundState = prop.dixitState;
    const story: Story | undefined = prop.story;
    const playCards: Array<PlayCard> = prop.playCards;
    const guesses: Array<Guess> = prop.guesses;

    const Guess = (prop: { playCard: PlayCard }) => {
        const playCard: PlayCard = prop.playCard;
        const guessers: Array<Player> = guesses.filter(guess => guess.playCard.equals(playCard))
            .map(guess => guess.guesser);

        const isGuessersEmpty = guessers.length === 0;

        return <div className="dixit-guess-zone">
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
    }

    const isScoring: boolean = SCORING === dixitState;
    const isGuessesEmpty = guesses.length === 0;
    if (isScoring && !isGuessesEmpty) {
        return <div className="dixit-guesses">
            {
                playCards.map(playCard => <Guess playCard={playCard}/>)
            }
            {story ? <Guess playCard={story.playCard}/> : <></>}
        </div>
    }
    return <></>
}

export default Guesses;