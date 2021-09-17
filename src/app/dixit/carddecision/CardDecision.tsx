import React from "react";
import {FcCancel, FcOk} from "react-icons/fc";

interface CardDecisionProp {
    className: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const CardDecision = (prop: CardDecisionProp) => {
    return (
        <div className={prop.className} style={{width: "330px", height: "105px"}}>
            <FcOk onClick={prop.onConfirm} style={{width: "40px", height: "40px"}}/>
            <FcCancel onClick={prop.onCancel} style={{width: "40px", height: "40px"}}/>
        </div>
    );
}

export default CardDecision;