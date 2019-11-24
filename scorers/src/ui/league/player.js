import React from 'react';

import Table from 'react-bootstrap/Table';

import _ from 'underscore';

import { generalStats, historyStats } from './stats';

export default function PlayerHistory(props) {
    const { name, team } = props;

    function renderValue(value, percent) {
        if (value !== undefined) {
            if (percent) {
                if (value < 0) {
                    value = '-';
                } else {
                    value += '%';
                }
            }
        } else {
            value = '-';
        }

        return value;
    }

    function renderStats() {
        return (
            <Table striped bordered hover>
                <tbody>
                    {generalStats.map((stat) => {
                        return (
                            <tr key={stat.value}>
                                <td width="200px"><b>{stat.name}</b></td>
                                <td>{renderValue(props[stat.value], stat.percent)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }

    function renderHistory() {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {_.flatten([
                            '#',
                            'Heim',
                            'Gast',
                            historyStats.map((stat) => stat.name),
                        ]).map((title) => (
                            <td key={title}>{title}</td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.teamGames.map((game, i) => {
                        const playerGame = props.gameHistory[game._id];

                        return (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{game.home}</td>
                                <td>{game.guest}</td>
                                {historyStats.map((stat) => (
                                    <td key={stat.value}>{renderValue(playerGame ? playerGame[stat.value] : undefined, stat.percent)}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        )
    }

    return (
        <>
            <h1>{name}</h1>
            <h2>{team}</h2>
            <br />
            <h3>Statistik</h3>
            {renderStats()}
            <br />
            <h3>Spiele</h3>
            {renderHistory()}
        </>
    );
}