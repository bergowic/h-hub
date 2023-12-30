import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import { getGame } from "./parser"
import { getPdfFromUrl } from "./pdf-loader"

const dynamoDb = new DynamoDB()

module.exports.parseGame = async (event, context) => {
  const message = JSON.parse(event.Records[0].body)
  const league = message.league
  const game = message.game

  console.log("league", league)
  console.log("game", game)

  const pdf = await getPdfFromUrl(game.report.url)
  const gameData = getGame(pdf)

  game.results = {
    home: {
      players: gameData.home.players,
    },
    guest: {
      players: gameData.guest.players,
    },
  }

  console.log("results", JSON.stringify(game))

  const params = {
    Item: marshall(game),
    TableName: process.env.TABLE_NAME,
  }

  return dynamoDb.putItem(params)
}
