'use strict'

const { getGames } = require('./parser')
const { getGame } = require('./storage')
const { sendMessage } = require('./queue')

const sendGame = async (queueUrl, league, game) => {
	const oldGame = await getGame(game._id)

	if (oldGame && oldGame.results) {
		return
	}

	console.log('game', game, oldGame)

	const body = {
		league: league,
		game: game,
	}

	return sendMessage(body)
}

module.exports.parseLeague = async (event, context) => {
	const league = JSON.parse(event.Records[0].body)

	console.log('league', league)

	const games = await getGames(league)

	return Promise.all(games)
		.filter(game => game.report)
		.map(async (game) => await sendGame(league, game))
}
