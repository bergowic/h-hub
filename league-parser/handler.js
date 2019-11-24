'use strict';

const AWS = require('aws-sdk');

const { getGames } = require('./parser');

const sqs = new AWS.SQS();
const dynamoDb = new AWS.DynamoDB();

async function sendGame(queueUrl, league, game) {
	return new Promise((success, fail) => {
		getGame(game, (err, data) => {
			if (err) {
				fail(err);
			} else {
				const oldGame = AWS.DynamoDB.Converter.unmarshall(data.Item);

				console.log('game', game, oldGame);
				game.leagueId = league._id;

				const body = {
					league: league,
					game: game,
				};
		
				const params = {
					MessageBody: JSON.stringify(body),
					QueueUrl: queueUrl
				};
		
				sqs.sendMessage(params, (err, res) => {
					console.log('send', err, res);
					if (err) {
						fail(err);
					} else {
						success(res);
					}
				});
			}
		});
	});
}

function getGame(game, cb) {
	const key = {
		_id: game._id
	};
	const params = {
		Key: AWS.DynamoDB.Converter.marshall(key),
		TableName: process.env.TABLE_NAME,
	};

	dynamoDb.getItem(params, cb);
}

module.exports.parseLeague = (event, context, cb) => {
	const accountId = context.invokedFunctionArn.split(":")[4];
	const queueUrl = 'https://sqs.eu-central-1.amazonaws.com/' + accountId + '/' + process.env.QUEUE_NAME;

	const league = JSON.parse(event.Records[0].body);

	console.log('league', league);

	getGames(league).then((games) => {
		return Promise.all(games
			.filter(game => game.report)
			.map(game => sendGame(queueUrl, league, game))
		)
	}).then(cb);
};
