'use strict';

const AWS = require('aws-sdk');
const request = require('request');
const PDFParser = require('pdf2json');
const gameParser = require('./parser');

const dynamoDb = new AWS.DynamoDB();

function getGameResults(url) {
	return new Promise((success, fail) => {
		const pdfParser = new PDFParser();

		pdfParser.on('pdfParser_dataError', errData => {
			fail(errData);
		});

		pdfParser.on('pdfParser_dataReady', pdfData => {
			const game = gameParser.getGame(pdfData);
			success(game);
		});

		request({url: url, encoding: null}, (err, response, buffer) => {
			pdfParser.parseBuffer(buffer);
		});
	});
}

module.exports.parseGame = (event, context, cb) => {
	const message = JSON.parse(event.Records[0].body);
	const league = message.league;
	const game = message.game;

	console.log('league', league);
	console.log('game', game);

	getGameResults(game.report.url).then((results) => {
		game.results = {
			home: {
				players: results.home.players
			},
			guest: {
				players: results.guest.players
			}
		};

		console.log('results', JSON.stringify(game));

		const params = {
			Item: AWS.DynamoDB.Converter.marshall(game),
			TableName: process.env.TABLE_NAME
		}

		dynamoDb.putItem(params, cb);
	}, (err) => {
		cb(err);
	});
};
