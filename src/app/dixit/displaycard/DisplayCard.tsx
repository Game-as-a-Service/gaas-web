import './DisplayCard.scss';
import React from "react";
import Card from "../model/domain/Card";

interface DisplayCardProp {
    card: Card;
}

const DisplayCard = (prop: DisplayCardProp) => {
    return <img className="dixit-display-card" src={`data:image/png;base64, ${prop.card.image}`} alt="card"/>;
}

export default DisplayCard;