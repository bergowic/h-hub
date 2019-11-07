'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB();
const s3 = new AWS.S3();

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

	dynamoDb.scan(params, (err, data) => {
		if (err) {
			cb(err);
		} else {
			const games = data.Items.map((game) => AWS.DynamoDB.Converter.unmarshall(game));

			games.forEach(game => console.log(game));

			s3.putObject({
				Bucket: process.env.BUCKET_NAME,
				Key: 'assets/league-' + league._id + '.json',
				Body: JSON.stringify(games),
				ContentType: 'application/json',
				CacheControl: 'no-cache',
			}, cb);
		}
	});
};
