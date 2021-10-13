import './DisplayCard.scss';
import React from "react";
import Card from "../../models/model/Card";

const DisplayCard = ({card}: { card: Card }) => {
    return (
        <img className="dixit-display-card" src={`data:image/png;base64, ${card.image}`} alt="card"/>
    );
}

export default DisplayCard;