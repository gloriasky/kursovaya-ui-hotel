import React from 'react';
import axios from 'axios';
import * as Auth from './AuthService';
import './App.css';

class App extends React.Component {

  state = {};

  componentDidMount() {
    axios.get('http://hotel-api-belarus.herokuapp.com/welcome',Auth.createConfig())
        .then(json => this.setState({message: json.data.message}))
        .catch(error => console.log(error))
  }

  render(){

    return (
        <div>
          {this.state.message}
        </div>
    );

  }

}

export default App;
