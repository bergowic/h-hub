'use strict'

const got = require('got')
const moment = require('moment-timezone')
const sha1 = require('sha1')
const util = require('util')

const LEAGUE_URL_PATTERN = 'https://spo.handball4all.de/service/if_g_json.php?ca=1&cl=%d&cmd=ps&og=%s'
const REPORT_URL_BASE = 'http://spo.handball4all.de/misc/sboPublicReports.php?sGID='

const getGame = (leagueId, rawGame) => {
  const game = {
    _id: sha1(leagueId + '-' + rawGame.gID + '-' + rawGame.gHomeTeam + '-' + rawGame.gGuestTeam),
    gameId: rawGame.gID,
    leagueId: leagueId,
    home: rawGame.gHomeTeam,
    guest: rawGame.gGuestTeam,
    time: moment(rawGame.gDate + ' ' + rawGame.gTime, 'DD.MM.YY HH:mm', 'Europe/Berlin').toDate(),
    gym: {
      name: rawGame.gGymnasiumName || null,
      street: rawGame.gGymnasiumStreet || null,
      zip: rawGame.gGymnasiumPostal ? parseInt(rawGame.gGymnasiumPostal, 10) : null,
      city: rawGame.gGymnasiumTown || null,
    },
  }

  if (rawGame.sGID) {
    game.report = {
      _id: parseInt(rawGame.sGID, 10),
      url: REPORT_URL_BASE + rawGame.sGID,
    }
  }

  return game
}

const getLeagueUrl = (league) => {
	return util.format(LEAGUE_URL_PATTERN, league.score, league.group)
}

module.exports.getGames = async (league) => {
  const response = await got(getLeagueUrl(league))

  return JSON.parse(response.body)[0]
    .content
    .futureGames
    .games
    .map((game) => getGame(league._id, game))
}
