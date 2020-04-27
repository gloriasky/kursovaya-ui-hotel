import React from 'react';
import * as Auth from './AuthService';
import * as _ from 'lodash';
import './RoomPage.css';
import axios from 'axios';
import {NavigationBar} from './NavigationBar'
import {routes} from "./routes";
import {Button, Card, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";

class RoomInfo extends React.Component {

    state = {};

    getImage(){
        const config = Auth.createConfig();
        config['responseType'] = 'blob';

        axios.get(`${routes.getImage}?search=../images/rooms/room-${this.props.room.roomNumber}.jpg`,config)
            .then(response => {
                let matrixData = response; //The response from flask's send_file
                console.log(response);
                let matrixBlob = new Blob([matrixData.data], {type:"image/jpg"});
                console.log(matrixBlob);
                let fileReader = new FileReader();
                fileReader.readAsDataURL(matrixBlob);
                fileReader.onload = () => {
                    let result = fileReader.result; console.log(result);
                    this.setState({ image: result
                    });
                }
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getImage();
    }

    render() {

        let room = this.props.room;
        let info = [];
        for (let key in room) {
            if (!['roomNumber','_id', 'status'].includes(key)) {
                info.push(<p>{Auth.beautifyKey(key)}: {room[key]}</p>)
            }
        }

        this.props.isAdmin && info.push(<p>{Auth.beautifyKey('status')}: {room.status}</p>);

        return (
            <Card border="dark" style={{width: '19rem', padding: 5, marginLeft:15, marginTop:15}}>
                <Card.Img variant="top" style={{maxHeight: 168}} src={this.state.image}/>
                <Card.Body>
                    <Card.Title>
                        {Auth.beautifyKey('room')}: {room.roomNumber}
                        {this.props.isAdmin && <img style={{height: 15, marginTop:-5}}
                                                    onClick={() => this.props.onUpdate(room._id)}
                                                    alt='edit'
                                                    src='edit.png'/>}
                    </Card.Title>
                    <Card.Text>
                        {info}
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

class RoomAdder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            roomNumber: '',
            capacity: '',
            price: '',
            status: ''
        }
    }

    componentDidMount() {
        if(this.props.room) {
            this.setState(this.props.room);
            this.setState({isUpdate: true})
        } else {
            this.setState({
                isUpdate: false,
                roomNumber: '',
                capacity: '',
                price: '',
                status: ''
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.room !== this.props.room){
            if(this.props.room) {
                this.setState(this.props.room);
                this.setState({isUpdate: true})
            } else {
                this.setState({
                    isUpdate: false,
                    roomNumber: '',
                    capacity: '',
                    price: '',
                    status: ''
                });
            }
        }
    }

    submit(e) {
        e.preventDefault();
        this.setState({triedToSubmit: true});
        let url = this.state.isUpdate ? routes.updateRoom + `?id=${this.state._id}` : routes.addRoom;
        axios.post(url, {
            'roomNumber': parseInt(this.state.roomNumber),
            'price': parseInt(this.state.price),
            'capacity': parseInt(this.state.capacity),
            'status': this.state.status ? this.state.status : 'Available',
        }, Auth.createConfig())
            .then(() => {
                alert(`Room ${this.state.roomNumber} was successfully created`);
                this.setState({
                    roomNumber: '',
                    capacity: '',
                    price: '',
                    status: ''
                });
                this.props.onClose(true)
            })
            .catch(error => alert(error.response.data))
            .finally(() => this.setState({
                triedToSubmit: false,
            }));

    }

    deleteRoom(event){
        event.preventDefault()
        axios.get(routes.deleteRoom + `?_id=${this.state._id}`, Auth.createConfig())
            .then(() => {
                alert(`Room ${this.state.roomNumber} was successfully deleted`);
                this.setState({
                    roomNumber: '',
                    capacity: '',
                    price: '',
                    status: ''
                });
                this.props.onClose(true)
            })
            .catch(error => alert(error.response.data))
            .finally(() => this.setState({
                triedToSubmit: false,
            }));
    }

    createSelectItems() {
        let statuses = ['Available', 'Taken', 'Closed to fix'];
        let items = [];
        for (let i = 0; i < statuses.length; i++) {
            items.push( <option key={i+1} value={statuses[i]}>{statuses[i]}</option>);
        }
        return items;
    }


    checkRequired(value) {
        return (value.length === 0 && this.state.triedToSubmit) ? 'error' : null;
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={() => this.props.onClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.isUpdate ? 'Update' : 'Add'} room form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="Room-form" onSubmit={e => this.handleSubmit(e)}>
                        <FormGroup controlId="number" className="required"
                                   validationState={this.checkRequired(this.state.roomNumber)}>
                            <FormLabel>Номер комнаты</FormLabel>
                            <FormControl type="text" value={this.state.roomNumber}
                                         onChange={e => this.setState({roomNumber: e.target.value})}/>
                        </FormGroup>
                        <FormGroup controlId="capacity" className="required"
                                   validationState={this.checkRequired(this.state.capacity)}>
                            <FormLabel>Вместимость</FormLabel>
                            <FormControl type="text" value={this.state.capacity}
                                         onChange={e => this.setState({capacity: e.target.value})}/>
                        </FormGroup>
                        <FormGroup controlId="price" className="required"
                                   validationState={this.checkRequired(this.state.price)}>
                            <FormLabel>Цена</FormLabel>
                            <FormControl type="text" value={this.state.price}
                                         onChange={e => this.setState({price: e.target.value})}/>
                        </FormGroup>
                        <FormGroup controlId="status">
                            <FormLabel>Статус</FormLabel>
                            <FormControl as="select" value={this.state.status}
                                         onChange={e => this.setState({status: e.target.value})}>
                                {this.createSelectItems()}
                            </FormControl>
                        </FormGroup>

                        {this.state.isUpdate && <Button type="submit"
                                                        className='float-left'
                                                        bsStyle="danger"
                                                        onClick={(event) => this.deleteRoom(event)}
                                                        loading={this.state.triedToSubmit}>Delete</Button>}

                        <Button type="submit"
                                className='float-right'
                                bsStyle="primary"
                                onClick={(event) => this.submit(event)}
                                loading={this.state.triedToSubmit}>Submit</Button>
                    </form>
                </Modal.Body>
            </Modal>

        );
    }

}

export class RoomPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rooms: []
        }
    }

    getRooms() {
        axios.get(routes.getRooms, Auth.createConfig())
            .then(json => this.setState({rooms: json.data}))
            .catch(error => console.log(error))
    }

    componentDidMount() {
        Auth.validatePermissions('admin')
            .then(() => this.setState({isAdmin: true}))
            .catch(() => this.setState({isAdmin: false}));
        this.getRooms()

    }

    getRoom(_id){
        axios.get(routes.getRoom + '?id='+_id, Auth.createConfig())
            .then(json => this.setState({room: json.data, updateRoom: true}))
            .catch(error => console.log(error))
    }

    render() {

        let rooms = this.state.rooms.map((v, i) => <RoomInfo room={v}
                                                                            onUpdate={(_id) => this.getRoom(_id)}
                                                                          isAdmin={this.state.isAdmin}
                                                                          key={i}/>);
        if (this.state.isAdmin) {
            rooms.push(<Card border="dark" style={{width: '19rem', padding: 5, marginLeft:15, marginTop:15}}>
                <Card.Img style={{maxHeight: 168}} variant="top" src="not-available.png"/>
                <Card.Body>
                    <Card.Text>
                        <Button onClick={() => this.setState({addRoom: true})}>Add room</Button>
                    </Card.Text>
                </Card.Body>
            </Card>);
        }

        return (
            <div>
                <NavigationBar/>
                <RoomAdder show={this.state.addRoom || this.state.updateRoom}
                                                  room={this.state.room}
                                                  onClose={(status) => {
                                                      this.setState({addRoom: false, updateRoom: false, room: ''});
                                                      status && this.getRooms();
                                                  }}/>
                <div className='Room-page-root d-block mx-auto'>
                    <h3 className='text-center'>Our Rooms</h3>
                    <div className='row'>
                        {rooms}
                    </div>
                </div>
            </div>
        );
    }

}
