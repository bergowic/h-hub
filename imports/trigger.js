'use strict';

const leagues = require('./leagues.json');
const sqs = require('@aws-sdk/client-sqs');

const SQS = new sqs.SQS();

exports.default = (event, context, cb) => {
	const accountId = context.invokedFunctionArn.split(":")[4];
	const queueUrl = 'https://sqs.eu-central-1.amazonaws.com/' + accountId + '/' + process.env.QUEUE_NAME;

	Promise.all(leagues.map((league) => {
		console.log('add league: ', league.name);

		const params = {
        MessageBody: JSON.stringify(league),
        QueueUrl: queueUrl
    };

		return SQS.sendMessage(params);
	})).then(() => {
		cb();
	}, cb);
};
