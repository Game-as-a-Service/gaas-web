import './Notification.scss';
import React from "react";

const Notification = ({message}: { message: string }) => {
    return (
        <span className="notification">
                {
                    // This place is use to format the message instead of outside.
                    message.replaceAll("-", " ")
                        .replaceAll("_", " ")
                }
                </span>
    );
}

export default Notification;