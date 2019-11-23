'use strict';

const request = require('request');
const moment = require('moment-timezone');

const REPORT_URL_BASE = 'http://spo.handball4all.de/misc/sboPublicReports.php?sGID=';

function getGame(rawGame) {
    const game = {
        gameId: rawGame.gID,
        home: rawGame.gHomeTeam,
        guest: rawGame.gGuestTeam,
        time: moment(rawGame.gDate + ' ' + rawGame.gTime, 'DD.MM.YY HH:mm', 'Europe/Berlin').toDate(),
        gym: {
            name: rawGame.gGymnasiumName,
            street: rawGame.gGymnasiumStreet,
            zip: parseInt(rawGame.gGymnasiumPostal, 10),
            city: rawGame.gGymnasiumTown,
        },
    }

    if (rawGame.sGID) {
        game.report = {
            _id: parseInt(rawGame.sGID, 10),
            url: REPORT_URL_BASE + rawGame.sGID,
        }
    }

    return game;
}

module.exports.getGames = async (url) => {
    return new Promise((resolve, reject) => {
        request(url, (err, response, buffer) => {
            if (err) {
                reject(err);
            } else {
                const games = JSON.parse(buffer)[0]
                    .content
                    .futureGames
                    .games
                    .map(getGame);
                
                resolve(games);
            }
        });
    });
}