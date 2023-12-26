'use strict'

const { SQS } = require("@aws-sdk/client-sqs");

const sqs = new SQS()

module.exports.sendMessage = (queueUrl, body) => {
  const params = {
		MessageBody: JSON.stringify(body),
		QueueUrl: queueUrl,
	}

	return sqs.sendMessage(params)
}
