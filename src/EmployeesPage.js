import React from 'react';
import axios from 'axios';
import * as Auth from './AuthService';
import './EmployeesPage.css';
import {NavigationBar} from './NavigationBar';
import Table from "react-bootstrap/Table";
import {routes} from "./routes";
import {Button, Modal, Form} from "react-bootstrap";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";

class EmployeeRow extends React.Component {

    render() {

        let employee = this.props.employee;

        return (
            <tr>
                <td>{this.props.index}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.position}</td>
                <td>{employee.dateOfBirth}</td>
                <td>{employee.hasAccess}</td>
                <td><img src='edit.png' alt='edit' onClick={() => this.props.onEdit()}/></td>
            </tr>
        );
    }

}

class EmployeeTable extends React.Component {

    render() {

        let employees = this.props.employees.map((v,i) => <EmployeeRow employee={v} key={i} index={i+1} onEdit={() => this.props.onEdit(v._id)}/>);

        return (
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Position</th>
                    <th>Date of Birth</th>
                    <th>Has Access</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                    {employees}
                </tbody>
            </Table>
        );
    }

}

class EmployeeForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           firstName: '',
           lastName: '',
           phone: '',
           position: '',
           email: '',
            dateOfBirth: '',
           permission: '',
            password: false
        }
    }

    componentDidMount() {
        if(this.props.employee) {
            this.setState(this.props.employee);
            this.setState({isUpdate: true})
        } else {
            this.setState({
                isUpdate: false,
                firstName: '',
                lastName: '',
                phone: '',
                dateOfBirth: '',
                position: '',
                email: '',
                permission: '',
                password: false
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.employee !== this.props.employee){
            if(this.props.employee) {
                this.setState(this.props.employee);
                this.setState({isUpdate: true})
            } else {
                this.setState({
                    isUpdate: false,
                    firstName: '',
                    lastName: '',
                    phone: '',
                    dateOfBirth: '',
                    position: '',
                    email: '',
                    permission: '',
                    password: false
                });
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({triedToSubmit: true});
        let url = this.state.isUpdate ? routes.updateEmployee + `?id=${this.state._id}` : routes.addEmployee;
        axios.post(url, {
            'firstName': this.state.firstName,
            'lastName': this.state.lastName,
            'phone': this.state.phone,
            'position': this.state.position,
            'email': this.state.email,
            'dateOfBirth': this.state.dateOfBirth,
            'createPassword': this.state.password,
            'permission': this.state.permission ? this.state.permission : 'view'
        }, Auth.createConfig())
            .then(() => {
                alert(`Employee ${this.state.email} was successfully created`);
                this.setState({
                    firstName: '',
                    lastName: '',
                    phone: '',
                    position: '',
                    dateOfBirth: '',
                    email: '',
                    permission: '',
                    password: false
                });
                this.props.onClose(true)
            })
            .catch(error => alert(error.response.data))
            .finally(() => this.setState({
                triedToSubmit: false,
            }));

    }

    createSelectItems() {
        let statuses = ['guest', 'view', 'admin'];
        let items = [];
        for (let i = 0; i < statuses.length; i++) {
            items.push( <option key={i+1} value={statuses[i]}>{statuses[i]}</option>);
        }
        return items;
    }


    checkRequired(value) {
        return (value.length === 0 && this.state.triedToSubmit) ? 'error' : null;
    }

    deleteEmployee(event){
        event.preventDefault();
        axios.get(routes.deleteEmployee + `?_id=${this.state._id}`, Auth.createConfig())
            .then(() => {
                alert(`Employee ${this.state.email} was successfully deleted`);
                this.setState({
                    firstName: '',
                    lastName: '',
                    phone: '',
                    position: '',
                    dateOfBirth: '',
                    email: '',
                    password: false,
                    permission: ''
                });
                this.props.onClose(true)
            })
            .catch(error => alert(error.response.data))
            .finally(() => this.setState({
                triedToSubmit: false,
            }));
    }


    render() {
        return (
            <Modal show={this.props.show} onHide={() => this.props.onClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.isUpdate ? 'Update' : 'Add'} employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="Employee-form" onSubmit={e => this.handleSubmit(e)}>
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
                        <FormGroup controlId="email" className="required"
                                   validationState={this.checkRequired(this.state.email)}>
                            <FormLabel>Email</FormLabel>
                            <FormControl type="email" value={this.state.email}
                                         onChange={e => this.setState({email: e.target.value})}/>
                        </FormGroup>
                        <FormGroup controlId="phone" className="required"
                                   validationState={this.checkRequired(this.state.phone)}>
                            <FormLabel>Phone</FormLabel>
                            <FormControl type="text" value={this.state.phone}
                                         onChange={e => this.setState({phone: e.target.value})}/>
                        </FormGroup>
                        <FormGroup controlId="position" className="required"
                                   validationState={this.checkRequired(this.state.position)}>
                            <FormLabel>Position</FormLabel>
                            <FormControl type="text" value={this.state.position}
                                         onChange={e => this.setState({position: e.target.value})}/>
                        </FormGroup>
                        <FormGroup controlId="dateOfBirth" className="required"
                                   validationState={this.checkRequired(this.state.dateOfBirth)}>
                            <FormLabel>Date of Birth (YYYY-MM-DD)</FormLabel>
                            <FormControl type="text" value={this.state.dateOfBirth}
                                         onChange={e => this.setState({dateOfBirth: e.target.value})}/>
                        </FormGroup>
                        <FormGroup controlId="status">
                            <FormLabel>Permission</FormLabel>
                            <FormControl as="select" value={this.state.permission}
                                         onChange={e => this.setState({permission: e.target.value})}>
                                {this.createSelectItems()}
                            </FormControl>
                        </FormGroup>
                        <Form.Check type="checkbox" checked={this.state.password} label={'Reset password'}
                                    onChange={e => this.setState({password: !this.state.password})}>
                        </Form.Check>


                        {this.state.isUpdate && <Button type="submit"
                                                        className='float-left'
                                                        bsStyle="danger"
                                                        onClick={(event) => this.deleteEmployee(event)}
                                                        loading={this.state.triedToSubmit}>Delete</Button>}

                        <Button type="submit"
                                className='float-right'
                                bsStyle="primary"
                                onClick={(event) => this.handleSubmit(event)}
                                loading={this.state.triedToSubmit}>Submit</Button>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }

}

export class EmployeesPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            employees: []
        }
    }

    getEmployees(){
        axios.get(routes.getEmployees, Auth.createConfig())
            .then(json => this.setState({employees: json.data}))
            .catch(error => console.log(error))
    }

    getEmployee(_id){
        axios.get(routes.getEmployee + '?id='+_id, Auth.createConfig())
            .then(json => this.setState({employee: json.data, update: true}))
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getEmployees()
    }

    render() {
        return (
            <div>
                <NavigationBar />
                <EmployeeForm show={this.state.add || this.state.update}
                           employee={this.state.employee}
                           onClose={(status) => {
                               this.setState({add: false, update: false, employee: ''});
                               status && this.getEmployees();
                           }}/>
                <div className='Employees-page-root d-block mx-auto'>
                    <h3 className='text-center'>Our Employees <img src='add-employee.png' alt='add' onClick={() => this.setState({add: true})} /></h3>
                    <EmployeeTable employees={this.state.employees} onEdit={(_id) => this.getEmployee(_id)}/>
                </div>
            </div>
        );
    }

}
