import _ from 'underscore';

import React from 'react';
import Table from 'react-bootstrap/Table';

import './index.ui.css';

function mergeGoalsOfPlayer(teamState, player) {
  if (!teamState[player.name]) {
    teamState[player.name] = {
      goals: 0,
      goals7m: 0,
      attempts7m: 0,
      games: 0
    };
  }

  const playerState = teamState[player.name];
  playerState.goals += player.goals;
  playerState.goals7m += player.goals7m;
  playerState.attempts7m += player.attempts7m;
  playerState.games += 1;
}

function mergeGoalsOfTeam(state, team, results) {
  if (!state[team]) {
    state[team] = {};
  }

  results.players.forEach(player => mergeGoalsOfPlayer(state[team], player));
}

function mergeGoalsOfGames(games) {
	const teams = {}

	games.forEach(game => {
		if (game.results) {
			mergeGoalsOfTeam(teams, game.home, game.results.home);
		  mergeGoalsOfTeam(teams, game.guest, game.results.guest);
		}
	});

	return teams;
}

function getPlayerArrayFromTeam(team, players) {
	return Object.keys(players).map(player => {
		return {
			...players[player],
			name: player,
			team: team,
		}
	});
}

const DEFAULT_STATE = {
	sort: {
		attr: 'goals',
		order: -1,
	},
	teams: undefined,
	team: undefined,
}

class League extends React.Component {
	constructor(props) {
		super(props);

		this.state = DEFAULT_STATE;
		this.loadLeague();

		this.onSort = this.onSort.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.leagueId !== prevProps.leagueId) {
			this.setState(DEFAULT_STATE);
			this.loadLeague();
		}
	}

	loadLeague() {
		const leagueId = process.env.NODE_ENV === 'development' ? 'test' : this.props.leagueId;

		fetch('/assets/league-' + leagueId + '.json')
			.then(resp => resp.json())
			.then((games) => {
				this.setState({teams: mergeGoalsOfGames(games)})
			})
			.catch((error) => {
				console.error(error)
			})
	}

	onSort(header) {
		const sort = {
			attr: header.sort
		}

		if (this.state.sort.attr === header.sort) {
			sort.order = this.state.sort.order * -1;
		} else {
			sort.order = -1;
		}

		this.setState({ sort });
	}

	renderHeader(header) {
		if (!header.sort) {
			return (
				<th key={header.name}>{header.name}</th>
			)
		}

		return (
			<th
				className="sortable"
				onClick={() => this.onSort(header)}
				key={header.name}
			>
				{header.name}
				{header.sort === this.state.sort.attr && (
					<i className={'arrow ' + (this.state.sort.order < 0 ? 'down' : 'up')} />
				)}
			</th>
		)
	}

	renderTeamSelect() {
		return (
			<select
				className="form-control"
				value={this.state.team}
				onChange={e => this.setState({team: e.target.value})}
			>
				<option value="">-- Mannschaft wählen --</option>
				{_.unique(Object.keys(this.state.teams))
					.sort()
					.map(team => (
						<option key={team}>{team}</option>
					))
				}
			</select>
		)
	}

	renderPlayers(players) {
		return (
			<div className="league">
				<Table striped bordered hover>
					<thead>
						<tr>
							{[
								{name: '#'},
								{name: 'Name'},
								{name: 'Tore', sort: 'goals'},
								{name: 'Spiele', sort: 'games'},
								{name: 'Tore / Spiel', sort: 'goalsPerGame'},
								{name: 'Feldtore', sort: 'goalsField'},
								{name: 'Feldtore / Spiel', sort: 'goalsFieldPerGame'},
								{name: '7m - Tore', sort: 'goals7m'},
								{name: '7m - Versuche', sort: 'attempts7m'},
								{name: '7m - Quote', sort: 'quote7m'},
								{name: this.renderTeamSelect()},
							].map(header => this.renderHeader(header))}
						</tr>
					</thead>
					<tbody>
						{players.map(player => {
							return {
								...player,
								goalsPerGame: Math.round((player.goals / player.games) * 100) / 100,
								goalsField: player.goals - player.goals7m,
								goalsFieldPerGame: Math.round(((player.goals - player.goals7m) / player.games) * 100) / 100,
								quote7m: player.attempts7m > 0 ? Math.round((player.goals7m / player.attempts7m) * 100) : -1,
							}
						}).sort((p1, p2) => {
							const sort = this.state.sort;
							const compare = p1[sort.attr] - p2[sort.attr];
							if (compare !== 0) {
								return compare * sort.order;
							}

							return p1.name.localeCompare(p2.name);
						}).map((player, id) => {
							return (
								<tr key={id}>
									<td>{id + 1}</td>
									<td>{player.name}</td>
									<td>{player.goals}</td>
									<td>{player.games}</td>
									<td>{player.goalsPerGame}</td>
									<td>{player.goalsField}</td>
									<td>{player.goalsFieldPerGame}</td>
									<td>{player.goals7m}</td>
									<td>{player.attempts7m}</td>
									<td>{player.quote7m < 0 ? '-' : player.quote7m + '%'}</td>
									<td>{player.team}</td>
								</tr>
							)
						})}
					</tbody>
				</Table>
			</div>
		)
	}

	render() {
		if (!this.state.teams) {
			return (
				<h2>Daten werden geladen...</h2>
			);
		}

		let players;
		if (this.state.team) {
			players = getPlayerArrayFromTeam(this.state.team, this.state.teams[this.state.team]);
		} else {
			players = [];
			Object.keys(this.state.teams)
				.forEach(team => {
					const teamPlayers = getPlayerArrayFromTeam(team, this.state.teams[team]);
					players = players.concat(teamPlayers)
				})
		}

		return this.renderPlayers(players);
	}
}

export default League;
