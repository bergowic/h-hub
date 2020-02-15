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

	return sendMessage(queueUrl, body)
}

module.exports.parseLeague = async (event, context) => {
	const accountId = context.invokedFunctionArn.split(':')[4]
	const queueUrl = 'https://sqs.eu-central-1.amazonaws.com/' + accountId + '/' + process.env.QUEUE_NAME
	const league = JSON.parse(event.Records[0].body)

	console.log('league', league);

	return Promise.all(
		(await getGames(league))
			.filter((game) => game.report)
			.map((game) => sendGame(queueUrl, league, game))
	)
}
