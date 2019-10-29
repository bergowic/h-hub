'use strict';

const AWS = require('aws-sdk');
const request = require('request');
const htmlParser = require('node-html-parser');

const sqs = new AWS.SQS();

function getGame(row) {
    const column = row.childNodes[row.childNodes.length - 1];
    const childNodes = column.childNodes.filter(node => node instanceof htmlParser.HTMLElement);

    if (childNodes.length < 1) {
        return null;
    }

    const childNode = childNodes[0];
    if (childNode.tagName !== 'a') {
        return null;
    }

    const attrs = childNode.rawAttrs;
    const start = attrs.indexOf('http');
    const end = attrs.indexOf('"', start);

    if (start < 0 || end < 0) {
        return null;
    }

		return {
			url: attrs.substring(start, end)
		}
}

function sendGame(queueUrl, league, game) {
	return new Promise((success, fail) => {
		const body = {
			league: league,
			game: game
		};

		const params = {
        MessageBody: JSON.stringify(body),
        QueueUrl: queueUrl
    };

		return sqs.sendMessage(params).promise();
	});
}

module.exports.parseLeague = (event, context, cb) => {
	const accountId = context.invokedFunctionArn.split(":")[4];
	const queueUrl = 'https://sqs.eu-central-1.amazonaws.com/' + accountId + '/' + process.env.QUEUE_NAME;

	const league = JSON.parse(event.Records[0].body);

	console.log('league', league);

	request(league.url, (err, response, buffer) => {
		if (err) {
			cb(err);
		} else {
			const html = htmlParser.parse(buffer);

			Promise.all(html.querySelectorAll('.gametable tr')
	      .map(getGame)
	      .filter(game => game !== null)
	      .map(game => sendGame(queueUrl, league, game))
	    ).then(() => {
				cb(null);
	    }, (err) => {
				cb(err);
			});
		}
	});
};
