import React from 'react';
import { Alert } from 'react-bootstrap';

export default function ErrorView(props) {
    return(
        <div style={{paddingTop: '10px', width: '100%'}}>
            <Alert variant="danger">{props.error}</Alert>
        </div>

    );
}