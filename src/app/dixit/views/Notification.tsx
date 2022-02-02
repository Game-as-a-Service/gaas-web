import './Notification.scss';
import React from "react";

const Notification = ({message}: { message: string }) => {
    return (
        <span className="notification">{message}</span>
    );
}

export default Notification;