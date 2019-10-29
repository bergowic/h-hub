'use strict';

const AWS = require('aws-sdk');
const request = require('request');
const PDFParser = require('pdf2json');
const gameParser = require('./parser');
const sha1 = require('sha1');

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

	request(game.url, (err, response, buffer) => {
		if (err) {
			cb(err)
		} else {
			getGameResults(game.url).then((results) => {
				game.leagueId = league._id;
				game.home = results.home.name;
				game.guest = results.guest.name;
				game.results = {
					home: {
						players: results.home.players
					},
					guest: {
						players: results.guest.players
					}
				};
				game._id = sha1(league._id + '-' + game.home + '-' + game.guest);

				console.log('results', JSON.stringify(game));

				const params = {
					Item: AWS.DynamoDB.Converter.marshall(game),
					TableName: process.env.TABLE_NAME
				}

				dynamoDb.putItem(params, cb);
			}, (err) => {
				cb(err);
			});
		}
	});
};
