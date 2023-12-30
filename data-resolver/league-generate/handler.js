'use strict';

const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { S3 } = require('@aws-sdk/client-s3');

const dynamoDb = new DynamoDB();
const s3 = new S3();

function unmarshallGames(games) {
	return games.map((game) => unmarshall(game));
}

module.exports.generateLeague = (event, context, cb) => {
	const league = JSON.parse(event.Records[0].body);

	console.log('leagues', event.Records.length)
	console.log('league', league);

	const params = {
		TableName: process.env.TABLE_NAME,
		ExpressionAttributeValues: marshall({
			':leagueId': league._id
		}),
		FilterExpression: 'leagueId = :leagueId',
	};

	let games = [];

	function onScan(err, data) {
		if (err) {
			cb(err);
		} else {
			games = games.concat(unmarshallGames(data.Items));

			if (data.LastEvaluatedKey) {
				params.ExclusiveStartKey = data.LastEvaluatedKey;
				dynamoDb.scan(params, onScan);
			} else {
				if (process.env.STAGE === 'prod') {
					s3.putObject({
						Bucket: process.env.BUCKET_NAME,
						Key: 'assets/league-' + league._id + '.json',
						Body: JSON.stringify(games),
						ContentType: 'application/json',
						CacheControl: 'no-cache',
					}, cb);
				} else {
					console.log('NOT IN PRODUCTION', JSON.stringify(games))
					cb()
				}
			}
		}
	}

	dynamoDb.scan(params, onScan);
};
