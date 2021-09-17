import './EventNotice.scss';
import React from "react";
import {CARD_PLAYING, PLAYER_GUESSING, RoundState, STORY_TELLING} from "./domain/RoundState";

interface EventNoticeProp {
    isShowEvent: boolean;
    dixitState: RoundState;
}

const EventNotice = (prop: EventNoticeProp) => {
    const isShowEvent: boolean = prop.isShowEvent;
    const dixitState: RoundState = prop.dixitState;
    if (isShowEvent && dixitState) {
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