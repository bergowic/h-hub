import React from 'react';

import Form from 'react-bootstrap/Form';

import {
	useHistory,
  useParams
} from "react-router-dom";

import leagues from 'imports/leagues.json';

function renderLeagueOption(league) {
	return (
		<option
			key={league._id}
			value={league._id}
		>
			{league.name}
		</option>
	);
}

function LeagueSelect() {
	const history = useHistory();
	const { leagueId } = useParams();

	const options = leagues.map(renderLeagueOption);
	if (!leagueId) {
		options.unshift(renderLeagueOption({_id: -1, name: 'Liga auswählen'}));
	}

	function onSelectLeague(e) {
		history.push('/?league=' + e.target.value);
	}

	return (
		<Form>
			<Form.Group>
		    <select className="form-control" value={leagueId} onChange={onSelectLeague}>
					{options}
		    </select>
  		</Form.Group>
		</Form>
	)
}

export default LeagueSelect;
