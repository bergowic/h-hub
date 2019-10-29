'use strict';

const _ = require('underscore');

const X_POS = Object.freeze({
    'NUMBER': [3.601, 3.7569999999999997],
    'PLAYER_NAME': 4.711,
    'GOALS': [18.284, 18.128],
    '7M': 19.999,
    'TEAM_NAME': 3.471,
    'META': 3.293
});

var Player = /** @class */ (function () {
    function Player(name, goals, goals7m, attempts7m) {
        this.name = name;
        this.goals = goals;
        this.goals7m = goals7m;
        this.attempts7m = attempts7m;
    }
    return Player;
}());

var Team = /** @class */ (function () {
    function Team(name, players) {
        this.name = name;
        this.players = players;
    }
    return Team;
}());

var Game = /** @class */ (function () {
    function Game(home, guest) {
        this.home = home;
        this.guest = guest;
    }
    return Game;
}());

function getTeamName(texts) {
    var text = _.find(texts, isTeamNameIndex);
    var t = decodeURIComponent(text.R[0].T);
    return t.substr(t.indexOf(':') + 2);
}

function getPlayerName(texts) {
    var text = _.find(texts, isPlayerNameIndex);
    return decodeURI(text.R[0].T);
}

function getGoals(texts) {
    var text = _.find(texts, isGoalsIndex);
    if (text) {
        return parseInt(text.R[0].T, 10);
    }
    return 0;
}

function getGoals7m(texts) {
    var text = _.find(texts, is7mIndex);
    if (text) {
        return parseInt(decodeURIComponent(text.R[0].T).split('/')[1], 10);
    }
    return 0;
}

function getAttempts7m(texts) {
    var text = _.find(texts, is7mIndex);
    if (text) {
        return parseInt(decodeURIComponent(text.R[0].T).split('/')[0], 10);
    }
    return 0;
}

function getPlayer(texts) {
    var name = getPlayerName(texts);
    var goals = getGoals(texts);
    var goals7m = getGoals7m(texts);
    var attempts7m = getAttempts7m(texts);
    return new Player(name, goals, goals7m, attempts7m);
}

function getTeam(texts) {
    var indices = texts.map(function (text, index) {
        return {
            start: isNumberIndex(text),
            index: index
        };
    })
        .filter(function (e) { return e.start; })
        .map(function (e) { return e.index; });
    var name = getTeamName(texts);
    var players = indices
        .map(function (i, index) { return texts.slice(i, indices[index + 1]); })
        .map(getPlayer);
    return new Team(name, players);
}

function isTeamNameIndex(text) {
    return text.x == X_POS.TEAM_NAME;
}

function isPlayerNameIndex(text) {
    return text.x == X_POS.PLAYER_NAME;
}

function isGoalsIndex(text) {
    return X_POS.GOALS.indexOf(text.x) >= 0;
}

function is7mIndex(text) {
    return text.x == X_POS['7M'];
}

function isNumberIndex(text) {
    return X_POS.NUMBER.indexOf(text.x) >= 0;
}

function isTeamIndex(text) {
    return text.x == X_POS.TEAM_NAME;
}

function isMetaIndex(text) {
    return text.x == X_POS.META;
}

function getHome(texts) {
    var start = _.findIndex(texts, isTeamIndex) + 1;
    var end = _.findLastIndex(texts, isTeamIndex);
    return getTeam(texts.slice(start, end));
}

function getGuest(texts) {
    var start = _.findLastIndex(texts, isTeamIndex);
    var end = _.findLastIndex(texts, isMetaIndex);
    return getTeam(texts.slice(start, end));
}

function getGame(pdf) {
    var page = pdf.formImage.Pages[1];
    var home = getHome(page.Texts);
    var guest = getGuest(page.Texts);
    return new Game(home, guest);
}

exports.getGame = getGame;
