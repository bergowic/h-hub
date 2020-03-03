'use strict'

const _ = require('underscore')

const parser = require('./parser')
const storage = require('./storage')
const { sendMessages } = require('./queue')

const BATCH_SEND_SIZE = 10
const BATCH_READ_SIZE = 100

const getGamesFromParser = parser.getGames
const getGamesFromStorage = storage.getGames

module.exports.parseLeague = async (event, context) => {
	const accountId = context.invokedFunctionArn.split(':')[4]
	const queueUrl = 'https://sqs.eu-central-1.amazonaws.com/' + accountId + '/' + process.env.QUEUE_NAME

	return Promise.all(event.Records.map(async (record) => {
		const league = JSON.parse(record.body);
		console.log('league', league);

		const games = await getGamesFromParser(league)
		let batches = []

		while (batches.length * BATCH_READ_SIZE < games.length) {
			const start = batches.length * BATCH_READ_SIZE
			batches.push(games.slice(start, start + BATCH_READ_SIZE))
		}

		const gamesToSend = _.flatten(await Promise.all(batches.map(async (batch) => {
			const oldGames = (await getGamesFromStorage(batch.map((game) => game._id)))
				.filter((game) => game.results)
				.map((game) => game._id)

			return batch.filter((game) => !oldGames.includes(game._id))
		})))

		batches = []
		while (batches.length * BATCH_SEND_SIZE < gamesToSend.length) {
			const start = batches.length * BATCH_SEND_SIZE
			batches.push(gamesToSend.slice(start, start + BATCH_SEND_SIZE))
		}

		return Promise.all(batches.map((batch) => {
			const messages = batch.map((game) => ({
				league: league,
				game: game,
			}))

			return sendMessages(queueUrl, messages)
		}))
	}));
}
