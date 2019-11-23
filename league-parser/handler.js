'use strict';

const AWS = require('aws-sdk');
const util = require('util');

const { getGames } = require('./parser');

const sqs = new AWS.SQS();

const LEAGUE_URL_PATTERN = 'https://spo.handball4all.de/service/if_g_json.php?ca=1&cl=%d&cmd=ps&og=%s'

function sendGame(queueUrl, league, game) {
	return new Promise((success, fail) => {
		const body = {
			league: league,
			game: game.report.url
		};

		const params = {
        MessageBody: JSON.stringify(body),
        QueueUrl: queueUrl
    };

		return sqs.sendMessage(params).promise();
	});
}

function getLeagueUrl(league) {
	return util.format(LEAGUE_URL_PATTERN, league.score, league.group);
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
