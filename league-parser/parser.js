'use strict';

const request = require('request');
const moment = require('moment-timezone');
const sha1 = require('sha1');
const util = require('util');

const LEAGUE_URL_PATTERN = 'https://spo.handball4all.de/service/if_g_json.php?ca=1&cl=%d&cmd=ps&og=%s'
const REPORT_URL_BASE = 'http://spo.handball4all.de/misc/sboPublicReports.php?sGID=';

function getGame(league, rawGame) {
    const game = {
        _id = sha1(league._id + '-' + rawGame.home + '-' + rawGame.guest);
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

function getLeagueUrl(league) {
	return util.format(LEAGUE_URL_PATTERN, league.score, league.group);
}

module.exports.getGames = async (league) => {
    return new Promise((resolve, reject) => {
        request(getLeagueUrl(league), (err, response, buffer) => {
            if (err) {
                reject(err);
            } else {
                const games = JSON.parse(buffer)[0]
                    .content
                    .futureGames
                    .games
                    .map((game) => getGame(league, game));
                
                resolve(games);
            }
        });
    });
}