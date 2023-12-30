'use strict'

const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamodb = new DynamoDB()

module.exports.getGame = async (id) => {
  const key = {
    _id: id,
  }
  const params = {
    Key: marshall(key),
    TableName: process.env.TABLE_NAME,
  }

  const result = await dynamodb.getItem(params)
  if (result.Item) {
	return unmarshall(result.Item)
  }
  
  return null  
}
