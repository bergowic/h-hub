import React from 'react';

import League from './index';

import {
  useLocation,
} from "react-router-dom";

function LeagueContainer() {
	const location = useLocation()
	const leagueId = location.search.substr('?league='.length);

	if (!leagueId) {
		return null;
	}

	return (
		<League leagueId={leagueId} />
	)
}

export default LeagueContainer;
