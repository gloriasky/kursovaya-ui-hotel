import React from 'react';
import * as Auth from './AuthService';
import * as _ from 'lodash';
import './Account.css';
import {NavigationBar} from './NavigationBar'

class Info extends React.Component {

    beautifyKey(key){
        return _.capitalize(_.upperCase(key))
    }

    render() {

        let info = []
        let user = this.props.user;
        for (let key in user) {
            info.push(<p>{this.beautifyKey(key)}: {user[key]}</p>)
        }

        return (
            <div>
                {info}
            </div>
        );
    }

}

export class Account extends React.Component {

    state = {};

    componentDidMount() {
        Auth.validatePermissions('admin')
            .then(() => this.setState({isAdmin: true}))
            .catch(() => this.setState({isAdmin: false}))
        this.setState({user: Auth.getUser()})
    }

    render() {

        return (
            <div>
                <NavigationBar/>
                <div className='Account-root d-block mx-auto'>
                    <h3 className='text-center'>Account Info for {Auth.getUser().firstName} {Auth.getUser().lastName}</h3>
                    {this.state.isAdmin &&
                    <h3 className='text-center'>You are logged as administrator</h3>}
                    <Info user={this.state.user} />
                </div>
            </div>
        );

    }

}
