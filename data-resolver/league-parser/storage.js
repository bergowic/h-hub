'use strict'

const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB()

const marshall = (arg) => {
  return AWS.DynamoDB.Converter.marshall(arg)
}

const unmarshall = (arg) => {
  return AWS.DynamoDB.Converter.unmarshall(arg)
}

module.exports.getGames = async (gameIds) => {
	const params = {
    RequestItems: {
  		[process.env.TABLE_NAME]: {
        Keys: gameIds.map((gameId) => marshall({
          _id: gameId
        })),
      }
    }
	}

  const result = await dynamoDb.batchGetItem(params).promise()
  return result.Responses[process.env.TABLE_NAME].map(unmarshall)
}
