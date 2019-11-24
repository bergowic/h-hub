import React from 'react';

import Button from 'react-bootstrap/Button';

import {
	useHistory,
} from 'react-router-dom';

import _ from 'underscore';

export function BackButton({ onClick }) {
    let history = useHistory()
    
    function _onClick() {
        if (_.isFunction(onClick)) {
            onClick();
        } else {
            history.goBack()
        }
    }

	return (
		<Button onClick={_onClick}>Zurück</Button>
	);
}
