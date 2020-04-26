import React from 'react';
import * as Auth from './AuthService';
import * as _ from 'lodash';
import './RoomPage.css';
import axios from 'axios';
import {NavigationBar} from './NavigationBar'
import {routes} from "./routes";
import {Card} from "react-bootstrap";

class RoomInfo extends React.Component {

    render() {

        let room = this.props.room;
        let info = []
        for (let key in room){
            if (key !== 'roomNumber'){
                info.push(<p>{Auth.beautifyKey(key)}: {room[key]}</p>)
            }
        }

        return (
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>{Auth.beautifyKey('roomNumber')} {room.roomNumber}</Card.Title>
                    <Card.Text>
                        {info}
                    </Card.Text>
                </Card.Body>
            </Card>
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
            .catch(() => this.setState({isAdmin: false}))
        this.getRooms()

    }

    render() {

        let rooms = this.state.rooms.map((v,i) => <RoomInfo room={v} key={i}/>)

        return (
            <div>
                <NavigationBar/>
                <div className='Room-page-root d-block mx-auto'>
                    <h3 className='text-center'>Our Rooms {this.state.isAdmin && <img alt='edit' src='edit.png'/>}</h3>
                    {rooms}
                </div>
            </div>
        );
    }

}
