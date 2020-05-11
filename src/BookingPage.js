import React from 'react';
import axios from 'axios';
import * as Auth from './AuthService';
import {NavigationBar} from "./NavigationBar";
import {routes} from "./routes";
import './BookingPage.css'
import {Card} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";

class BookingRow extends React.Component {

    canEdit() {
        let booking = this.props.booking;
        let from = booking.from.split('T')[0];
        let to = booking.to.split('T')[0];
        return (new Date(from) > new Date()) || (new Date(to) >= new Date() && this.props.isAdmin);
    }

    render() {
        let booking = this.props.booking;
        let from = booking.from.split('T')[0];
        let to = booking.to.split('T')[0];

        let days = Auth.getDateDifference(from, to);

        let finalPrice = days * booking.room.price + days * booking.servicesPrice;

        console.log(booking.status.split(' ').join('-'))

        return (

            <tr className={booking.status.split(' ').join('-')}>
                <td>{this.props.index}</td>
                <td>{from}</td>
                <td>{to}</td>
                {this.props.isAdmin && <td>{booking.guestEmail}</td>}
                <td>{booking.room.roomNumber}</td>
                <td>{booking.room.capacity}</td>
                <td>{booking.services}</td>
                <td>{finalPrice}</td>
                <td>{Auth.beautifyKey(booking.status)}</td>
                <td>{this.canEdit() && <a href={`/booking`} ><img src='/edit.png'
                                                         alt='edit'
                                                            onClick={() => Auth.saveBookingId(booking._id)}/></a>}
                </td>
            </tr>
        );
    }

}


export class EditBooking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            room: {
                roomNumber: ''
            },
            booking: {
                from: '',
                to: ''
            },
            selected: [],
            services: [],
            statuses: ['Booked', 'Cancelled', 'Checked In', 'Checked Out'],
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.booking !== this.state.booking) {
            this.getImage()
        }
    }

    getImage(){
        const config = Auth.createConfig();
        config['responseType'] = 'blob';

        axios.get(`${routes.getImage}?search=../images/rooms/room-${this.state.booking.room.capacity}.jpg`,config)
            .then(response => {
                let matrixBlob = new Blob([response.data], {type:"image/jpg"});
                let fileReader = new FileReader();
                fileReader.readAsDataURL(matrixBlob);
                fileReader.onload = () => {
                    let result = fileReader.result;
                    this.setState({ image: result });
                }
            })
            .catch(error => console.log(error))
    }

    getServices() {
        let url = routes.getServices + `?filter=Available`;
        axios.get(url, Auth.createConfig())
            .then(json => this.setState({services: json.data}))
            .catch(error => console.log(error))
    }

    componentDidMount() {
        axios.get(routes.getUserBooking + '?id='+Auth.getBookingId(), Auth.createConfig())
            .then(json => {
                this.setState({booking: json.data, selected: json.data.services, status: json.data.status, room: json.data.room});
            })
            .catch(error => console.log(error));
        Auth.validatePermissions('admin')
            .then(() => this.setState({isAdmin: true}))
            .catch(() => this.setState({isAdmin: false}));
        this.getServices();
    }

    updateBooking(){
        let services = [];
        for (let service in this.state.selected) {
            services.push(this.state.selected[service]._id)
        }

        let data = {
            _id: this.state.booking._id,
            roomId: this.state.room._id,
            guestId: this.state.booking.guestId,
            from: new Date(this.state.booking.from),
            to: new Date(this.state.booking.to),
            servicesIds: services,
            status: this.state.status
        };
        axios.post(routes.updateBooking, data, Auth.createConfig())
            .then(json => alert(json.data))
            .catch(error => console.log(error))
    }

    handleSelection(event){
        this.setState({selected: this.checkSelection(event.target.value)});
    }
    checkSelection(selected){
        if(selected.indexOf('all') > -1) {
            return this.state.services
        }else if (selected.indexOf('none') > -1){
            return [];
        }
        return selected;
    }

    createSelectItems() {
        let items = [];
        if(this.state.services) {
            items.push( <MenuItem key={0} value='all'>
                <ListItemText>
                    <strong style ={{fontSize: 12}}>Select all</strong>
                </ListItemText>
            </MenuItem>);
            items.push( <MenuItem key={1} value='none'>
                <ListItemText>
                    <strong style ={{fontSize: 12}}>Deselect all</strong>
                </ListItemText>
            </MenuItem>);
            items.push(<Divider variant="middle" />);
            for (let i = 0; i < this.state.services.length; i++) {
                items.push( <MenuItem key={i+2} value={this.state.services[i]}>
                    <Checkbox checked={this.state.selected.indexOf(this.state.services[i]) > -1}/>
                    <ListItemText primary={this.state.services[i].name} />
                </MenuItem>);
            }
        }

        return items;

    }

    getString(selected) {
        let str = '';
        for (let sel in selected) {
            str += selected[sel]['name'] + ', '
        }
        return str
    }

    getFinalPrice() {
        let days = Auth.getDateDifference(this.state.booking.from, this.state.booking.to);
        let sum = this.state.room.price * days;
        for (let service in this.state.selected) {
            sum += this.state.selected[service].price * days;
        }
        return sum;
    }

    getStatuses(){
        let statuses = [];
        for (let ind in this.state.statuses) {
            if (ind < 2) {
                statuses.push(<MenuItem key={ind} value={this.state.statuses[ind]}>
                    <ListItemText primary={this.state.statuses[ind]} />
                </MenuItem>)
            } else {
                if(this.state.isAdmin) {
                    statuses.push(<MenuItem key={ind} value={this.state.statuses[ind]}>
                        <ListItemText primary={this.state.statuses[ind]} />
                    </MenuItem>)
                }
            }
        }
        return statuses;
    }

    render() {

        let booking = this.state.booking;
        let from = booking.from.split('T')[0];
        let to = booking.to.split('T')[0];

        return (
            <div>
                <NavigationBar/>
                <div className='Booking-page-root mx-auto d-block'>
                    <h3 className='text-center'>You booked the room {this.state.room.roomNumber}</h3>
                    <h4 className='text-center'>{from} - {to}</h4>
                    <h4 className='text-center'>Room info:</h4>
                    <div className='row' style={{marginLeft:10}}>
                        <img style={{maxHeight: 168, marginRight: 10}} src={this.state.image} alt='room picture'/>
                        <div>
                            <p>Room capacity: {this.state.room.capacity}</p>
                            <p>Room price: {this.state.room.price}</p>
                            <div>
                            <label className='lbl' htmlFor='operatorCB'>Choose services:</label>
                            <Select multiple
                                    name='operators'
                                    style={{ width: 300}}
                                    value = {this.state.selected}
                                    onChange={event => this.handleSelection(event)}
                                    renderValue={selected => this.getString(selected)}>
                                {this.createSelectItems()}
                            </Select>
                            </div>
                            <div>
                            <label className='lbl' htmlFor='operatorCB'>Change status:</label>
                            <Select name='operators'
                                    style={{ width: 300}}
                                    value = {this.state.status}
                                    onChange={event => this.setState({status: event.target.value})}>
                                        {this.getStatuses()}
                            </Select>
                            </div>
                        </div>
                    </div>
                    <div className='row' style={{marginLeft: 10}}>
                        <p>Final price: {this.getFinalPrice()}</p>
                        <a className='float-right'
                           style={{marginLeft: 20}}
                           href='/my/bookings'
                           onClick={() => this.updateBooking()}>Save</a>
                    </div>
                </div>
            </div>
        );
    }

}


class BookingTable extends React.Component {

    render() {
        let bookings = this.props.bookings.map((v,i) => <BookingRow booking={v}
                                                                    isAdmin={this.props.isAdmin}
                                                                    key={i} index={i+1}/>);

        return (
            <Table bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Date From</th>
                    <th>Date To</th>
                    {this.props.isAdmin && <th>Guest email</th>}
                    <th>Room Number</th>
                    <th>Room Capacity</th>
                    <th>Additional Services</th>
                    <th>Final price</th>
                    <th>Status</th>
                    <th />
                </tr>
                </thead>
                <tbody>
                {bookings}
                </tbody>
            </Table>);
    }

}

export class MyBookingsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bookings: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.isAdmin !== this.state.isAdmin){
            axios.get(this.state.isAdmin ? routes.getAllBookings : routes.getUserBookings, Auth.createConfig())
                .then(json => this.setState({bookings: json.data}))
                .catch(error => console.log(error))
        }
    }


    componentDidMount() {
        Auth.validatePermissions('admin')
            .then(() => this.setState({isAdmin: true}))
            .catch(() => this.setState({isAdmin: false}))
    }

    render() {
        return (
            <div>
                <NavigationBar />
                <div className='My-booking-page-root d-block mx-auto'>
                    <h3 className='text-center'>{this.state.isAdmin ? 'All' : 'My'} Bookings</h3>
                    <BookingTable isAdmin={this.state.isAdmin} bookings={this.state.bookings}/>
                </div>
            </div>
        );
    }
}

export class BookingPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            room: {
                roomNumber: ''
            },
            selected: [],
            services: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.room !== this.state.room) {
            this.getImage()
        }
    }

    getImage(){
        const config = Auth.createConfig();
        config['responseType'] = 'blob';

        axios.get(`${routes.getImage}?search=../images/rooms/room-${this.state.room.capacity}.jpg`,config)
            .then(response => {
                let matrixBlob = new Blob([response.data], {type:"image/jpg"});
                let fileReader = new FileReader();
                fileReader.readAsDataURL(matrixBlob);
                fileReader.onload = () => {
                    let result = fileReader.result;
                    this.setState({ image: result });
                }
            })
            .catch(error => console.log(error))
    }

    getServices() {
        let url = routes.getServices + `?filter=Available`;
        axios.get(url, Auth.createConfig())
            .then(json => this.setState({services: json.data, selected: json.data}))
            .catch(error => console.log(error))
    }


    componentDidMount() {
        const id = Auth.getRoomId();
        const from = Auth.getFrom();
        const to = Auth.getTo();
        axios.get(routes.getRoom + '?id='+id, Auth.createConfig())
            .then(json => this.setState({room: json.data, from: from, to: to}))
            .catch(error => console.log(error));
        this.getServices();
    }

    saveBooking(){

        let services = [];
        for (let service in this.state.selected) {
            services.push(this.state.selected[service]._id)
        }

        let data = {
            roomId: this.state.room._id,
            from: new Date(this.state.from),
            to: new Date(this.state.to),
            servicesIds: services
        };
        axios.post(routes.saveBooking, data, Auth.createConfig())
            .then(json => alert(json.data))
            .catch(error => console.log(error))
    }

    handleSelection(event){
        this.setState({selected: this.checkSelection(event.target.value)});
    }
    checkSelection(selected){
        if(selected.indexOf('all') > -1) {
            return this.state.services
        }else if (selected.indexOf('none') > -1){
            return [];
        }
        return selected;
    }


    createSelectItems() {
        let items = [];
        if(this.state.services) {
            items.push( <MenuItem key={0} value='all'>
                <ListItemText>
                    <strong style ={{fontSize: 12}}>Select all</strong>
                </ListItemText>
            </MenuItem>);
            items.push( <MenuItem key={1} value='none'>
                <ListItemText>
                    <strong style ={{fontSize: 12}}>Deselect all</strong>
                </ListItemText>
            </MenuItem>);
            items.push(<Divider variant="middle" />);
            for (let i = 0; i < this.state.services.length; i++) {
                items.push( <MenuItem key={i+2} value={this.state.services[i]}>
                    <Checkbox checked={this.state.selected.indexOf(this.state.services[i]) > -1}/>
                    <ListItemText primary={this.state.services[i].name} />
                </MenuItem>);
            }
        }
        return items;

    }

    getString(selected) {
        console.log(selected)
        let str = '';
        for (let sel in selected) {
            console.log(sel)
            str += selected[sel]['name'] + ', '
        }
        return str
    }

    getFinalPrice() {
        let days = Auth.getDateDifference(this.state.from, this.state.to);
        let sum = this.state.room.price * days;
        for (let service in this.state.selected) {
            sum += this.state.selected[service].price * days;
        }
        return sum;
    }

    render() {
        return (
            <div>
                <NavigationBar/>
                <div className='Booking-page-root mx-auto d-block'>
                    <h3 className='text-center'>You are in process of booking the room {this.state.room.roomNumber}</h3>
                    <h4 className='text-center'>{this.state.from} - {this.state.to}</h4>
                    <h4 className='text-center'>Room info:</h4>
                    <div className='row' style={{marginLeft:10}}>
                        <img style={{maxHeight: 168, marginRight: 10}} src={this.state.image} alt='room picture'/>
                        <div>
                        <p>Room capacity: {this.state.room.capacity}</p>
                        <p>Room price: {this.state.room.price}</p>
                            <label className='lbl' htmlFor='operatorCB'>Choose services:</label>
                            <Select multiple
                                    name='operators'
                                    style={{ width: 300}}
                                    value = {this.state.selected}
                                    onChange={event => this.handleSelection(event)}
                                    renderValue={selected => this.getString(selected)}>
                                {this.createSelectItems()}
                            </Select>

                        </div>
                    </div>
                    <div className='row' style={{marginLeft: 10}}>
                        <p>Final price: {this.getFinalPrice()}</p><a className='float-right' href='/my/bookings' onClick={() => this.saveBooking()}>Book</a>
                    </div>
                </div>
            </div>
        );
    }

}
