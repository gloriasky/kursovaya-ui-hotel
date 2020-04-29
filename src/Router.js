import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import App from './App'
import * as Auth from './AuthService'
import {Login} from './Login';
import {Account} from './Account'
import {RoomPage} from "./RoomPage";
import {ServicePage} from "./ServicePage";
import {EmployeesPage} from "./EmployeesPage";

export const router = <BrowserRouter>
    <Switch>
        <Route path='/account'
               render={props => Auth.loggedIn() ? <Account {...props}/> : <Redirect to={Auth.redirectToLogin()}/>}
        />
        <Route path='/login'
               render={props => <Login {...props}/>}
        />
        <Route path='/rooms'
               render={props => <RoomPage {...props}/>}
        />
        <Route path='/services'
               render={props => <ServicePage {...props}/>}
        />
        <Route path='/employees'
               render={props => Auth.loggedIn() ? <EmployeesPage {...props}/> : <Redirect to={Auth.redirectToLogin()}/>}

        />
        <Route path='/*'
               render={props => <App {...props}/>}/>}
        />
    </Switch>
</BrowserRouter>;
