import React from 'react';

import {
  Link,
} from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function Footer() {
	return (
		<Navbar fixed="bottom" bg="light" variant="light">
			<Nav className="mr-auto">
				<Link to="/?page=impressum">Impressum</Link>
			</Nav>
		</Navbar>
	)
}

export default Footer;
