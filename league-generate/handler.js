'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB();
const s3 = new AWS.S3();

function unmarshallGames(games) {
	return games.map((game) => AWS.DynamoDB.Converter.unmarshall(game));
}

module.exports.generateLeague = (event, context, cb) => {
	const league = JSON.parse(event.Records[0].body);

	console.log('league', league);

	const params = {
		TableName: process.env.TABLE_NAME,
		ExpressionAttributeValues: AWS.DynamoDB.Converter.marshall({
			':leagueId': league._id
		}),
		FilterExpression: 'leagueId = :leagueId',
	};

	let games = [];

	onScan(err, data) {
		if (err) {
			cb(err);
		} else {
			games = games.concat(unmarshallGames(data.Items));

			if (data.LastEvaluatedKey) {
				params.ExclusiveStartKey = data.LastEvaluatedKey;
				dynamoDb.scan(params, onScan);
			} else {
				s3.putObject({
					Bucket: process.env.BUCKET_NAME,
					Key: 'assets/league-' + league._id + '.json',
					Body: JSON.stringify(games),
					ContentType: 'application/json',
					CacheControl: 'no-cache',
				}, cb);
			}
		}
	}

	dynamoDb.scan(params, onScan);
};
