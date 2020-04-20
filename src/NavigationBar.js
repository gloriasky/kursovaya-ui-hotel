import React, {Component} from 'react';
import * as Auth from './AuthService';
import './NavigationBar.css';
import {properties} from "./properties";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

 export class NavigationBar extends Component {

    render() {

        let title = <img alt='account' src='/account.png' />;

        return (
            <div>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href="#home">{properties.hotelName}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                        </Nav>
                        {!Auth.loggedIn() && <Nav.Link href="/login" inline><img alt='login' src='login.png' /></Nav.Link>}
                        {Auth.loggedIn() &&  <div><NavDropdown title={title} alignRight id="basic-nav-dropdown">
                            <NavDropdown.Item href="/account">See account info</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/" inline onClick={() => Auth.logout()}>Log out</NavDropdown.Item>
                        </NavDropdown></div>}
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }

}

