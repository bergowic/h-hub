import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
	useHistory,
} from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import LeagueSelect from 'ui/league/select';
import LeagueContainer from 'ui/league/container';
import Footer from './footer';
import Impressum from 'ui/impressum';

function BackButton() {
	let history = useHistory()

	return (
		<Button onClick={() => history.goBack()}>Zurück</Button>
	);
}

function App() {
	return (
		<Router>
			<Container>
				<Row>
					<Col lg={12}>
						<h1>HVR Torschützen</h1>
					</Col>
				</Row>
				<Switch>
					<Route path="/impressum">
						<Impressum />
						<BackButton />
					</Route>
					<Route path="/">
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
					</Route>
				</Switch>
				<Footer />
			</Container>
		</Router>
	)
}

export default App;
