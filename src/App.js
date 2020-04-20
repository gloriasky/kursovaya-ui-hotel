import React from 'react';
import axios from 'axios';
import * as Auth from './AuthService';
import './App.css';
import {properties} from "./properties";
import {NavigationBar} from './NavigationBar'

class App extends React.Component {

  state = {};

  componentDidMount() {
    axios.get(`${properties.apiUrl}/welcome`,Auth.createConfig())
        .then(json => this.setState({message: json.data.message}))
        .catch(error => console.log(error))
  }

  render(){

    return (
        <div>
          <NavigationBar />
           <div className='App-root d-block mx-auto'>
               {Auth.loggedIn() && <h3 className='text-center'>Welcome {Auth.getUser().firstName} to {properties.hotelName}</h3>}
               {this.state.message}
           </div>
        </div>
    );

  }

}

export default App;
