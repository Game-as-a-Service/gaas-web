import './EventNotice.scss';
import React from "react";
import {CARD_PLAYING, PLAYER_GUESSING, RoundState, STORY_TELLING} from "./model/RoundState";

const EventNotice = (prop: { dixitState: RoundState }) => {
    const dixitState: RoundState = prop.dixitState;
    if (dixitState) {
        const isStoryTelling: boolean = STORY_TELLING === dixitState;
        const isCardPlaying: boolean = CARD_PLAYING === dixitState;
        const isPlayerGuessing: boolean = PLAYER_GUESSING === dixitState;
        if (isStoryTelling || isCardPlaying || isPlayerGuessing) {
            return <span className="event-notice">{dixitState.replaceAll("-", " ")}</span>
        }
    }
    return <></>
}

export default EventNotice;