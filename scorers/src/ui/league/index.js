import _ from 'underscore';

import React from 'react';
import Table from 'react-bootstrap/Table';

import { BackButton } from '../controls/button';
import Player from './player';

import './index.ui.css';

import { generalStats } from './stats';

function mergeGoalsOfPlayer(teamState, game, player) {
	if (!teamState.players[player.name]) {
		teamState.players[player.name] = {
			goals: 0,
			goals7m: 0,
			attempts7m: 0,
			games: 0,
			gameHistory: {},
			teamGames: teamState.games,
			yellowCards: 0,
			redCards: 0,
			timePenalties: 0,
		};
	}

	const playerState = teamState.players[player.name];
	playerState.goals += player.goals;
	playerState.goals7m += player.goals7m;
	playerState.attempts7m += player.attempts7m;
	playerState.games += 1;
	playerState.gameHistory[game._id] = {
		goals: player.goals,
		goalsField: player.goals - player.goals7m,
		goals7m: player.goals7m,
		attempts7m: player.attempts7m,
		quote7m: calcQuote(player.goals7m, player.attempts7m),
		timePenalties: player.timePenalties,
		yellowCard: player.yellowCard,
		redCard: player.redCard,
		game: game,
	};
	playerState.yellowCards += player.yellowCard ? 1 : 0;
	playerState.redCards += player.redCard ? 1 : 0;
	playerState.timePenalties += player.timePenalties;
}

function mergeGoalsOfTeam(state, game, team) {
	const teamName = game[team];
	if (!state[teamName]) {
		state[teamName] = {
			players: {},
			games: []
		};
	}

	game.results[team].players.forEach(player => mergeGoalsOfPlayer(state[teamName], game, player));
	state[teamName].games.push(game);
}

function mergeGoalsOfGames(games) {
	const teams = {}

	games
		.sort((g1, g2) => {
			if (g1.time && g2.time) {
				return g1.time.localeCompare(g2.time)
			} else if (g1.time) {
				return -1
			} else {
				return 1
			}
		})
		.forEach(game => {
			if (game.results) {
				mergeGoalsOfTeam(teams, game, 'home');
				mergeGoalsOfTeam(teams, game, 'guest');
			}
		});

	return teams;
}

function getPlayerArrayFromTeam(teamName, team) {
	return Object.keys(team.players).map(player => {
		return {
			...team.players[player],
			name: player,
			team: teamName,
		}
	});
}

function calcQuote(success, trials) {
	return trials > 0 ? Math.round((success / trials) * 100) : -1
}

const DEFAULT_STATE = {
	sort: {
		attr: 'goals',
		order: -1,
	},
	teams: undefined,
	team: undefined,
	player: undefined,
}

class League extends React.Component {
	constructor(props) {
		super(props);

		this.state = DEFAULT_STATE;
		this.loadLeague();

		this.onSort = this.onSort.bind(this);
		this.onSelectPlayer = this.onSelectPlayer.bind(this);
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
			attr: header.value
		}

		if (this.state.sort.attr === header.value) {
			sort.order = this.state.sort.order * -1;
		} else {
			sort.order = -1;
		}

		this.setState({ sort });
	}

	onSelectPlayer(player) {
		this.setState({ player })
	}

	renderHeader(header) {
		if (!header.value) {
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
				{header.value === this.state.sort.attr && (
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
							{_.flatten([
								{name: '#'},
								{name: 'Name'},
								generalStats,
								{name: this.renderTeamSelect()},
							]).map(header => this.renderHeader(header))}
						</tr>
					</thead>
					<tbody>
						{players.map(player => {
							return {
								...player,
								goalsPerGame: Math.round((player.goals / player.games) * 100) / 100,
								goalsField: player.goals - player.goals7m,
								goalsFieldPerGame: Math.round(((player.goals - player.goals7m) / player.games) * 100) / 100,
								quote7m: calcQuote(player.goals7m, player.attempts7m),
							}
						}).sort((p1, p2) => {
							const sort = this.state.sort;
							const compare = p1[sort.attr] - p2[sort.attr];
							if (compare !== 0) {
								return compare * sort.order;
							}

							return p1.name.localeCompare(p2.name);
						}).map((player, i) => {
							return (
								<tr key={i} onClick={() => this.onSelectPlayer(player)}>
									<td>{i + 1}</td>
									<td>{player.name}</td>
									<td>{player.goals}</td>
									<td>{player.games}</td>
									<td>{player.goalsPerGame}</td>
									<td>{player.goalsField}</td>
									<td>{player.goalsFieldPerGame}</td>
									<td>{player.goals7m}</td>
									<td>{player.attempts7m}</td>
									<td>{player.quote7m < 0 ? '-' : player.quote7m + '%'}</td>
									<td>{player.timePenalties}</td>
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
		if (this.state.player) {
			return (
				<>
					<Player {...this.state.player} />
					<BackButton onClick={() => this.onSelectPlayer(null)} />
				</>
			)
		} else if (this.state.team) {
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
