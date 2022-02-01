import React from 'react';
import { Alert } from 'react-bootstrap';

export default function NotificationView(props) {
    return(
        <div style={{paddingTop: '10px',width: '100%'}}>
            <Alert variant="success">{props.message}</Alert>
        </div>

    );
}