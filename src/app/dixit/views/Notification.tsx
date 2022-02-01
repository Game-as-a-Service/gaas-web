import './Notification.scss';
import React from "react";

const Notification = ({message}: { message: string }) => {
    return (
        <span className="notification">
                {
                    // Since many messages shown here contain 'underscores', which must be filtered off,
                    // we write the filter code here.
                    //
                    // This is not a good design choice. However, the best solution may be to filter the format from the backend API.
                    message.replaceAll("-", " ")
                        .replaceAll("_", " ")
                }
                </span>
    );
}

export default Notification;