import React from "react";
import {FcCancel, FcOk} from "react-icons/fc";

interface CardDecisionProp {
    className: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const CardDecision = ({className, onConfirm, onCancel}: CardDecisionProp) => {
    return (
        <div className={className} style={{width: "330px", height: "105px"}}>
            <FcOk onClick={onConfirm} style={{width: "40px", height: "40px"}}/>
            <FcCancel onClick={onCancel} style={{width: "40px", height: "40px"}}/>
        </div>
    );
}

export default CardDecision;