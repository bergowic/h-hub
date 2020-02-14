'use strict'

const AWS = require('aws-sdk')

const sqs = new AWS.SQS()

module.exports.sendMessage = (body) => {
  const queyUrlParams = {
    QueueName: process.env.QUEUE_NAME
  }
  const queueUrl = sqs.getQueueUrl(queyUrlParams)

  const params = {
		MessageBody: JSON.stringify(body),
		QueueUrl: queueUrl,
	}

	return sqs.sendMessage(params).promise()
}
