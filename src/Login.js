import React, {Component} from 'react';
import './Login.css';
import axios from 'axios';
import * as Auth from './AuthService';
import './NavigationBar.css';
import {NavigationBar} from "./NavigationBar";
import Card from "react-bootstrap/Card";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {routes} from "./routes";

class Reset extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            triedToSubmit: false
        }
    }

    checkRequired(value) {
        return (value.length === 0 && this.state.triedToSubmit) ? 'error' : null;
    }

    handleSubmit(e){
        e.preventDefault();
        if(this.state.email.length > 0) {
            axios.get(`${routes.resetPassword}?email=${this.state.email}&login=true`, {})
                .then(() => {
                    alert('New password was sent to ' + this.state.email);
                    this.props.onClose()
                })
                .catch(error => alert(error.response.data))
                .finally(() => this.setState({
                    triedToSubmit: false
                }));
        } else {
            alert('Email is empty!')
        }
    }

    render() {
        return(
            <Modal show onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset password</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <div>
                        <form onSubmit={e => this.handleSubmit(e)}>
                            <FormGroup controlId="email"
                                       validationState={this.checkRequired(this.state.email)}>
                                <FormLabel column={7}>Email</FormLabel>

                                <FormControl type="email" value={this.state.email}
                                             onChange={e => this.setState({email: e.target.value})}/>
                            </FormGroup>
                            <Button style={{float:'right'}} type="submit" bsStyle="primary" loading={this.state.submitInProgress} onClick={e => this.handleSubmit(e)}>Send e-mail</Button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

class Registration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            company: '',
            password2: '',
            password: '',
            triedToSubmit: false,
            submitInProgress: false
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({triedToSubmit: true});
        if (this.state.email.length > 0) {
            if (this.state.password === this.state.password2) {
                this.setState({submitInProgress: true});
                axios.post(routes.createUser, {
                    'email': this.state.email,
                    'firstName': this.state.firstName,
                    'lastName': this.state.lastName,
                    'phone': this.state.phone,
                    'password': this.state.password,
                }, Auth.createConfig())
                    .then(() => {
                        alert(`User ${this.state.email} was successfully created`);
                        this.setState({
                            email: '',
                            firstName: '',
                            lastName: '',
                            phone: '',
                        });
                    })
                    .catch(error => alert(error.response.data))
                    .finally(() => this.setState({
                        triedToSubmit: false,
                        submitInProgress: false
                    }));
            } else {
                alert ('Passwords don\'t match')
            }
        }
    }

    checkRequired(value) {
        return (value.length === 0 && this.state.triedToSubmit) ? 'error' : null;
    }

    render() {
        return (
            <div className="">
                <Card border="primary">
                    <Card.Header>
                        Create User
                        <div className='link float-right' onClick={() => this.props.handleClick()}>Back to login</div>
                    </Card.Header>
                    <Card.Body>
                        <form className="User-form" onSubmit={e => this.handleSubmit(e)}>
                            <FormGroup controlId="email" className="required"
                                       validationState={this.checkRequired(this.state.email)}>
                                <FormLabel>Email</FormLabel>
                                <FormControl type="email" value={this.state.email}
                                             onChange={e => this.setState({email: e.target.value})}/>
                            </FormGroup>
                            <FormGroup controlId="firstName" className="required"
                                       validationState={this.checkRequired(this.state.firstName)}>
                                <FormLabel>First Name</FormLabel>
                                <FormControl type="text" value={this.state.firstName}
                                             onChange={e => this.setState({firstName: e.target.value})}/>
                            </FormGroup>
                            <FormGroup controlId="lastName" className="required"
                                       validationState={this.checkRequired(this.state.lastName)}>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl type="text" value={this.state.lastName}
                                             onChange={e => this.setState({lastName: e.target.value})}/>
                            </FormGroup>
                            <FormGroup controlId="phone">
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl type="text" value={this.state.phone}
                                             onChange={e => this.setState({phone: e.target.value})}/>
                            </FormGroup>
                            <FormGroup controlId="password">
                                <FormLabel>Input your password</FormLabel>
                                <FormControl type="password" value={this.state.password}
                                             onChange={e => this.setState({password: e.target.value})}/>
                            </FormGroup>
                            <FormGroup controlId="phone">
                                <FormLabel>Подтвердите пароль</FormLabel>
                                <FormControl type="password" value={this.state.password2}
                                             onChange={e => this.setState({password2: e.target.value})}/>
                            </FormGroup>
                            <Button type="submit" className='float-right' bsStyle="primary" loading={this.state.submitInProgress}>Submit</Button>
                        </form>
                    </Card.Body>
                </Card>
            </div>
        );
    }

}

export class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            triedToSubmit: false,
            submitInProgress: false,
            error: null,
            showModal: false,
            isRegistration: false
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({triedToSubmit: true});
        if (this.state.email.length > 0 && this.state.password.length > 0) {
            this.setState({submitInProgress: true});
            axios.post(routes.login, {
                'login': this.state.email,
                'password': this.state.password,
            }, {withCredentials: true})
                .then(json => {
                    Auth.login(json.data.jwt, json.data.user);
                    this.props.history.replace(Auth.extractRedirect());
                })
                .catch(error => this.setState({error: error.response.data, submitInProgress: false}));
        }
    }

    checkRequired(value) {
        return (value.length === 0 && this.state.triedToSubmit) ? 'error' : null;
    }

    render() {
        return (
            <div>
                <NavigationBar />
                {!this.state.isRegistration && <div className="Login-root d-block mx-auto">
                <Card>
                    <Card.Body>
                        <form onSubmit={e => this.handleSubmit(e)}>
                            <FormGroup controlId="email"
                                       validationState={this.checkRequired(this.state.email)}>
                                <FormLabel>Login</FormLabel>
                                <FormControl type="email" value={this.state.email}
                                             onChange={e => this.setState({email: e.target.value})}/>
                            </FormGroup>
                            <FormGroup controlId="password"
                                       validationState={this.checkRequired(this.state.password)}>
                                <FormLabel>Password</FormLabel>
                                <FormControl type="password" value={this.state.password}
                                             onChange={e => this.setState({password: e.target.value})}/>
                            </FormGroup>
                            { this.state.error && <span className="text-danger">{this.state.error}</span> }
                            <Button style={{marginBottom:10}} type="submit" bsStyle="primary" className="d-block mx-auto" loading={this.state.submitInProgress}>Log In</Button>
                            <p className='link' style={{float: 'right'}} onClick={() => this.setState({isRegistration:true})}>Want to sign up?</p>
                            <p className='link' onClick={() => this.setState({showModal:true})}>Forget your password?</p>
                        </form>
                    </Card.Body>
                </Card>
                </div>}
                {this.state.isRegistration && <div className='Login-root d-block mx-auto'>
                    <Registration handleClick={() => this.setState({isRegistration:false})} />
                </div>}
                {this.state.showModal && <Reset onClose={() => this.setState({showModal: false})}/>}
            </div>
        );
    }
}
