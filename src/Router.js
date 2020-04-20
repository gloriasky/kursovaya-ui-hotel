import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App'
import {Login} from './Login';

export const router = <BrowserRouter>
    <Switch>
        <Route path='/login'
               render={props => <Login {...props}/>}
        />
        <Route path='/*'
               render={props => <App {...props}/>}/>}
        />
    </Switch>
</BrowserRouter>;
