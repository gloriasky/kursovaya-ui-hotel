import React from 'react';
import axios from 'axios';
import * as Auth from './AuthService';
import './App.css';
import {properties} from "./properties";
import {NavigationBar} from './NavigationBar'
import Form from "react-bootstrap/Form";
import '@material-ui/core'
import TextField from "@material-ui/core/TextField";
import {routes} from "./routes";
import {RoomInfo} from "./RoomPage";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dateFrom: new Date().toLocaleDateString(),
            dateTo: new Date().toLocaleDateString(),
            rooms: []
        }
    }

    componentDidMount() {
        Auth.validatePermissions('admin')
            .then(() => this.setState({isAdmin: true}))
            .catch(() => this.setState({isAdmin: false}))
    }

    search(){
        if (this.state.dateFrom >= this.state.dateTo){
            alert('Dates are incorrect')
        } else {
            this.setState({rooms: []});
            let data = {
                capacity: parseInt(this.state.capacity),
                dateFrom: new Date(this.state.dateFrom),
                dateTo: new Date(this.state.dateTo)
            };
            axios.post(routes.getAvailableRooms, data, Auth.createConfig())
                .then(json => this.setState({rooms: json.data, numOfDays: Auth.getDateDifference(this.state.dateFrom, this.state.dateTo)}))
                .catch(error => console.log(error))
        }
    }

    render() {

        let rooms = this.state.rooms.map((v, i) => <RoomInfo room={v}
                                                             button={<a href={`/book/room`}
                                                                        className='float-right'
                                                                        onClick={() => Auth.saveBookingInfo(v._id, this.state.dateFrom, this.state.dateTo)}>Book</a>}
                                                             numOfDays={this.state.numOfDays}
                                                             isAdmin={false}
                                                             key={i}/>);

        return (
            <div>
                <NavigationBar/>
                <div className='App-root d-block mx-auto'>
                    {Auth.loggedIn() &&
                    <h3 className='text-center'>Welcome {Auth.getUser().firstName} to {properties.hotelName}</h3>}
                    {(Auth.loggedIn() && this.state.isAdmin) &&
                    <h3 className='text-center'>You are logged as administrator</h3>}
                    <Form onSubmit={e => this.handleSubmit(e)} className='d-block mx-auto text-center'>
                        <TextField
                            id="date"
                            label="From"
                            type="date"
                            value={this.state.dateFrom}
                            onChange={(event) => this.setState({dateFrom: event.target.value})}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="date"
                            label="To"
                            style={{marginLeft: 10}}
                            type="date"
                            onChange={(event) => this.setState({dateTo: event.target.value})}
                            value={this.state.dateTo}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Capacity"
                            type="text"
                            style={{marginLeft: 10}}
                            value={this.state.capacity}
                            onChange={(event) => this.setState({capacity: event.target.value})}
                        />
                        <img alt='found'
                             className='d-inline'
                             src='search.png'
                             style={{marginLeft: 10}}
                             onClick={() => this.search()}/>
                    </Form>
                    {this.state.rooms.length > 0 && <h3 className='text-center'>Available rooms</h3>}
                    {rooms}
                </div>
            </div>
        );

    }

}

export default App;
