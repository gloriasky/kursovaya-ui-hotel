import React from 'react';
import axios from 'axios';
import * as Auth from './AuthService';
import './EmployeesPage.css';
import {NavigationBar} from './NavigationBar';
import Table from "react-bootstrap/Table";
import {routes} from "./routes";
import {Modal} from "react-bootstrap";
import {Registration} from "./Login";

class GuestRow extends React.Component {

    render() {

        let guest = this.props.guest;

        return (
            <tr>
                <td>{this.props.index}</td>
                <td>{guest.firstName}</td>
                <td>{guest.lastName}</td>
                <td>{guest.email}</td>
                <td>{guest.phone}</td>
                <td>{guest.numOfArrivals}</td>
            </tr>
        );
    }

}

class GuestsTable extends React.Component {

    render() {

        let guests = this.props.guests.map((v,i) => <GuestRow guest={v} key={i} index={i+1}/>);

        return (
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Number of stayings</th>
                </tr>
                </thead>
                <tbody>
                    {guests}
                </tbody>
            </Table>
        );
    }

}

export class GuestsPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            guests: [],
            add: false
        }
    }

    getGuests(){
        axios.get(routes.getGuests, Auth.createConfig())
            .then(json => this.setState({guests: json.data}))
            .catch(error => console.log(error))
    }

    getGuest(_id){
        axios.get(routes.getGuest + '?id='+_id, Auth.createConfig())
            .then(json => this.setState({guest: json.data, update: true}))
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getGuests()
    }

    onClose() {
        this.setState({add: false});
        this.getGuests();
    }

    render() {
        return (
            <div>
                <NavigationBar />
                <Modal show={this.state.add} onHide={() => this.onClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.isUpdate ? 'Update' : 'Add'} employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Registration />
                    </Modal.Body>
                </Modal>
                <div className='Guests-page-root d-block mx-auto'>
                    <h3 className='text-center'>Registered Guests <img src='add-employee.png' alt='add' onClick={() => this.setState({add: true})} /></h3>
                    <GuestsTable guests={this.state.guests}/>
                </div>
            </div>
        );
    }

}
