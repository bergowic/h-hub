import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import LeagueSelect from 'ui/league/select';
import LeagueContainer from 'ui/league/container';

function defaultRoute() {
	return (
		<Container>
			<Row>
				<Col lg={12}>
					<h1>HVR Torschützen</h1>
				</Col>
			</Row>
			<Row>
				<Col lg={12}>
					<LeagueSelect />
				</Col>
			</Row>
			<Row>
				<Col lg={12}>
					<LeagueContainer />
				</Col>
			</Row>
		</Container>
	)
}

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/">
					{defaultRoute()}
				</Route>
			</Switch>
		</Router>
	)
}

export default App;
