'use strict';

const AWS = require('aws-sdk');

const { getGames } = require('./parser');

const sqs = new AWS.SQS();
const dynamoDb = new AWS.DynamoDB();

async function sendGame(queueUrl, league, game) {
	const oldGame = await getGame(game);
	console.log('game', game, oldGame);
	return new Promise((success, fail) => {
		game.leagueId = league._id;

		const body = {
			league: league,
			game: game,
		};

		const params = {
			MessageBody: JSON.stringify(body),
			QueueUrl: queueUrl
		};

		return sqs.sendMessage(params).promise();
	});
}

async function getGame(game) {
	const key = {
		_id: game._id
	};
	const params = {
		Key: AWS.DynamoDB.Converter.marshall(key),
		TableName: process.env.TABLE_NAME,
	};

	return dynamodb.getItem(params);
}

module.exports.parseLeague = (event, context, cb) => {
	const accountId = context.invokedFunctionArn.split(":")[4];
	const queueUrl = 'https://sqs.eu-central-1.amazonaws.com/' + accountId + '/' + process.env.QUEUE_NAME;

	const league = JSON.parse(event.Records[0].body);

	console.log('league', league);

	getGames(getLeagueUrl(league)).then((games) => {
		return Promise.all(games
			.filter(game => game.report)
			.map(game => sendGame(queueUrl, league, game))
		)
	}).then(cb);
};
