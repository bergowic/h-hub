import React from 'react';

import Button from 'react-bootstrap/Button';

import { useNavigate } from 'react-router-dom';

import _ from 'underscore';

export function BackButton({ onClick }) {
    let navigate = useNavigate()
    
    function _onClick() {
        if (_.isFunction(onClick)) {
            onClick();
        } else {
            navigate(-1)
        }
    }

	return (
		<Button onClick={_onClick}>Zurück</Button>
	);
}
