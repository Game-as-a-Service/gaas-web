import React from "react";
import {FcCancel, FcOk} from "react-icons/fc";

interface CardDecisionProperties {
    className: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const CardDecisionComponent = ({className, onConfirm, onCancel}: CardDecisionProperties) => {
    return (
        <div className={className}>
            <FcOk onClick={onConfirm} style={{width: "40px", height: "40px"}}/>
            <FcCancel onClick={onCancel} style={{width: "40px", height: "40px"}}/>
        </div>
    );
}

export default CardDecisionComponent;