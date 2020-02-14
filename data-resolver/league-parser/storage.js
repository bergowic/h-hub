'use strict'

const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB()

const marshall = (arg) => {
  return AWS.DynamoDB.Converter.marshall(arg)
}

const unmarshall = (arg) => {
  return AWS.DynamoDB.Converter.unmarshall(arg)
}

module.exports.getGame = async (id) => {
  const key = {
		_id: id,
	}
	const params = {
		Key: marshall(key),
		TableName: process.env.TABLE_NAME,
	}

  const result = await dynamoDb.getItem(params).promise()

  return unmarshall(result.Item)
}
