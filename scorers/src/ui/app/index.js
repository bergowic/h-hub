import React from 'react';

import {
	BrowserRouter as Router,
	useHistory,
} from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import League from 'ui/league';
import Footer from './footer';
import LeagueSelect from 'ui/league/select';
import Impressum from 'ui/impressum';

import { useQuery } from '../../utils/url';

function BackButton() {
	let history = useHistory()

	return (
		<Button onClick={() => history.goBack()}>Zurück</Button>
	);
}

function Content() {
	const query = useQuery();

	switch (query.get('page')) {
		case 'impressum':
			return (
				<>
					<Impressum />
					<BackButton />
				</>
			);
		case 'league':
			return (
				<>
					<Row>
						<Col lg={12}>
							<LeagueSelect />
						</Col>
					</Row>
					<Row>
						<Col lg={12}>
							<League leagueId={query.get('leagueId')} />
						</Col>
					</Row>
				</>
			)
		default:
			return (
				<>
					<Row>
						<Col lg={12}>
							<LeagueSelect />
						</Col>
					</Row>
				</>
			)
	}
}

function App() {
	return (
		<Container>
			<Row>
				<Col lg={12}>
					<h1>HVR Torschützen</h1>
				</Col>
			</Row>
			<Content />
			<Footer />
		</Container>
	)
}

function RoutedApp() {
	return (
	  <Router>
		<App />
	  </Router>
	);
  }

export default RoutedApp;
