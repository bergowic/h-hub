"use strict"

import { Output, Text } from "pdf2json"
import { Game, Player, Team } from "./model"
import _ from "underscore"

const X_POS = Object.freeze({
  NUMBER: [3.601, 3.7569999999999997],
  PLAYER_NAME: 4.711,
  GOALS: [18.284, 18.128],
  "7M": 19.999,
  TEAM_NAME: 3.471,
  META: 3.293,
  YELLOW_CARD: 21.635,
  TIME_PENALTY: [23.495, 25.267, 27.039],
  RED_CARD: 28.81,
})

function getTeamName(texts: Text[]) {
  var text = _.find(texts, isTeamNameIndex)
  if (text === undefined) {
    return "unknown"
  }
  var t = decodeURIComponent(text.R[0].T)
  return t.substr(t.indexOf(":") + 2)
}

const getPlayerName = (texts: Text[]) => {
  const text = _.find(texts, isPlayerNameIndex)
  if (text === undefined) {
    return "unknown"
  }
  const rawName = decodeURI(text.R[0].T)
  const numberChangeIndex = rawName.indexOf("(")
  if (numberChangeIndex >= 0) {
    return rawName.substring(0, numberChangeIndex).trim()
  }

  return rawName
}

function getGoals(texts: Text[]) {
  var text = _.find(texts, isGoalsIndex)
  if (text) {
    return parseInt(text.R[0].T, 10)
  }
  return 0
}

function getGoals7m(texts: Text[]) {
  var text = _.find(texts, is7mIndex)
  if (text) {
    return parseInt(decodeURIComponent(text.R[0].T).split("/")[1], 10)
  }
  return 0
}

function getAttempts7m(texts: Text[]) {
  var text = _.find(texts, is7mIndex)
  if (text) {
    return parseInt(decodeURIComponent(text.R[0].T).split("/")[0], 10)
  }
  return 0
}

function hasYellowCard(texts: Text[]) {
  var text = _.find(texts, isYellowCardIndex)
  return Boolean(text)
}

function hasRedCard(texts: Text[]) {
  var text = _.find(texts, isRedCardIndex)
  return Boolean(text)
}

function getTimePenalties(texts: Text[]) {
  var texts = _.filter(texts, isTimePenaltyIndex)
  return texts.length
}

const getPlayer = (texts: Text[]): Player => {
  return {
    name: getPlayerName(texts),
    goals: getGoals(texts),
    goals7m: getGoals7m(texts),
    attempts7m: getAttempts7m(texts),
    yellowCard: hasYellowCard(texts),
    redCard: hasRedCard(texts),
    timePenalties: getTimePenalties(texts),
  }
}

const getTeam = (texts: Text[]): Team => {
  var indices = texts
    .map(function (text, index) {
      return {
        start: isNumberIndex(text),
        index: index,
      }
    })
    .filter(function (e) {
      return e.start
    })
    .map(function (e) {
      return e.index
    })
  var name = getTeamName(texts)
  var players = indices
    .map(function (i, index) {
      return texts.slice(i, indices[index + 1])
    })
    .map(getPlayer)
  return { name, players }
}

function isTeamNameIndex(text: Text) {
  return text.x == X_POS.TEAM_NAME
}

function isPlayerNameIndex(text: Text) {
  return text.x == X_POS.PLAYER_NAME
}

function isGoalsIndex(text: Text) {
  return X_POS.GOALS.indexOf(text.x) >= 0
}

function is7mIndex(text: Text) {
  return text.x == X_POS["7M"]
}

function isNumberIndex(text: Text) {
  return X_POS.NUMBER.indexOf(text.x) >= 0
}

function isTeamIndex(text: Text) {
  return text.x == X_POS.TEAM_NAME
}

function isMetaIndex(text: Text) {
  return text.x == X_POS.META
}

function isYellowCardIndex(text: Text) {
  return text.x == X_POS.YELLOW_CARD
}

function isRedCardIndex(text: Text) {
  return text.x == X_POS.RED_CARD
}

function isTimePenaltyIndex(text: Text) {
  return X_POS.TIME_PENALTY.indexOf(text.x) >= 0
}

const getHome = (texts: Text[]): Team => {
  var start = _.findIndex(texts, isTeamIndex) + 1
  var end = _.findLastIndex(texts, isTeamIndex)
  return getTeam(texts.slice(start, end))
}

const getGuest = (texts: Text[]): Team => {
  var start = _.findLastIndex(texts, isTeamIndex)
  var end = _.findLastIndex(texts, isMetaIndex)
  return getTeam(texts.slice(start, end))
}

export const parseGame = (pdf: Output): Game => {
  var page = pdf.Pages[1]
  var home = getHome(page.Texts)
  var guest = getGuest(page.Texts)
  return { home, guest }
}
