'use strict'

const AWS = require('aws-sdk')

const sqs = new AWS.SQS()

module.exports.sendMessage = (queueUrl, body) => {
  const params = {
		MessageBody: JSON.stringify(body),
		QueueUrl: queueUrl,
	}

	return sqs.sendMessage(params).promise()
}
