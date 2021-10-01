import './DisplayCard.scss';
import React from "react";
import Card from "../model/Card";


const DisplayCard = (prop: { card: Card }) => {
    return <img className="dixit-display-card" src={`data:image/png;base64, ${prop.card.image}`} alt="card"/>;
}

export default DisplayCard;