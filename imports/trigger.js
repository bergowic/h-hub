'use strict';

const leagues = require('./leagues.json');
const AWS = require('aws-sdk');

const sqs = new AWS.SQS();

exports.default = (event, context, cb) => {
	const accountId = context.invokedFunctionArn.split(":")[4];
	const queueUrl = 'https://sqs.eu-central-1.amazonaws.com/' + accountId + '/' + process.env.QUEUE_NAME;

	Promise.all(leagues.map((league) => {
		console.log('add league: ', league.name);

		const params = {
        MessageBody: JSON.stringify(league),
        QueueUrl: queueUrl
    };

		return sqs.sendMessage(params).promise();
	})).then(() => {
		cb();
	}, cb);
};
