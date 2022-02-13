import './NotificationComponent.scss';
import React from "react";

const NotificationComponent = ({message}: { message: string }) => {
    return (
        <span className="notification">{message}</span>
    );
}

export default NotificationComponent;