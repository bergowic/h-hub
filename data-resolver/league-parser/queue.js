'use strict'

const AWS = require('aws-sdk')

const sqs = new AWS.SQS()

module.exports.sendMessages = (queueUrl, messages) => {
  const params = {
		Entries: messages.map((message) => {
      return {
        Id: message.game._id,
        MessageBody: JSON.stringify(message),
      }
    }),
		QueueUrl: queueUrl,
	}

	return sqs.sendMessageBatch(params).promise()
}
