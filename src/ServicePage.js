import React from 'react';
import * as Auth from './AuthService';
import './ServicePage.css';
import axios from 'axios';
import {NavigationBar} from './NavigationBar'
import {routes} from "./routes";
import {Button, Card, Modal} from "react-bootstrap";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";

class ServiceInfo extends React.Component {

    state = {};

    getImage(){
        const config = Auth.createConfig();
        config['responseType'] = 'blob';

        axios.get(`${routes.getImage}?search=../images/services/${this.props.service.name}.jpg`,config)
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

        let service = this.props.service;
        let info = [];
        for (let key in service) {
            if (!['name', '_id', 'status'].includes(key)) {
                info.push(<p>{Auth.beautifyKey(key)}: {service[key]}</p>)
            }
        }

        this.props.isAdmin && info.push(<p>{Auth.beautifyKey('status')}: {service.status}</p>);

        return (
            <Card border="dark" style={{width: '19rem', padding: 5, marginLeft: 15, marginTop: 15}}>
                <Card.Img variant="top" style={{maxHeight: 168}} src={this.state.image}/>
                <Card.Body>
                    <Card.Title>
                        {service.name}
                        {this.props.isAdmin && <img style={{height: 15, marginTop: -5}}
                                                    onClick={() => this.props.onUpdate(service._id)}
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

class ServiceAdder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            section: '',
            price: '',
            status: '',
            file: ''
        }
    }

    componentDidMount() {
        if (this.props.service) {
            this.setState(this.props.service);
            this.setState({isUpdate: true})
        } else {
            this.setState({
                isUpdate: false,
                name: '',
                section: '',
                price: '',
                status: '',
                file: ''
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.service !== this.props.service) {
            if (this.props.service) {
                this.setState(this.props.service);
                this.setState({isUpdate: true})
            } else {
                this.setState({
                    isUpdate: false,
                    name: '',
                    section: '',
                    price: '',
                    status: '',
                    file: ''
                });
            }
        }
    }

    uploadFile(e) {
        var formData = new FormData();
        var input = e.target;
        if (input.files.length > 0) {
            for (let file of input.files) {
                formData.append(file.name, file);
            }
            const config = Auth.createConfig();
            config['headers']['Content-Type'] = 'multipart/form-data';
            config['onUploadProgress'] = progressEvent => {
                this.setState({progress: progressEvent.loaded < progressEvent.total ? 'Uploading files...' : 'Processing files...'});
            };
            axios
                .post(`${routes.uploadImage}?path=../images/services/`, formData, config)
                .then(resp => {
                    alert('Your files were successfully uploaded!');
                   })
                .catch(error => alert(error.response.data))
                .finally(() => {
                    input.value = '';
                    this.setState({progress: ''});
                });
        }

    }


    submit(e) {
        e.preventDefault();
        this.setState({triedToSubmit: true});
        let url = this.state.isUpdate ? routes.updateService + `?id=${this.state._id}` : routes.addService;
        const config = Auth.createConfig();
        axios.post(url, {
            'name': this.state.name,
            'section': this.state.section,
            'price': parseInt(this.state.price),
            'status': this.state.status ? this.state.status : 'Available',
        }, config)
            .then(() => {
                alert(`Service ${this.state.name} was successfully created`);
                this.setState({
                    name: '',
                    section: '',
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

    deleteService(event) {
        event.preventDefault();
        axios.get(routes.deleteService + `?_id=${this.state._id}`, Auth.createConfig())
            .then(() => {
                alert(`Service ${this.state.roomNumber} was successfully deleted`);
                this.setState({
                    name: '',
                    section: '',
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
        let statuses = ['Available', 'Not Available'];
        let items = [];
        for (let i = 0; i < statuses.length; i++) {
            items.push(<option key={i + 1} value={statuses[i]}>{statuses[i]}</option>);
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
                    <Modal.Title>{this.state.isUpdate ? 'Update' : 'Add'} service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="Service-form" onSubmit={e => this.handleSubmit(e)}>
                        <FormGroup controlId="name" className="required"
                                   validationState={this.checkRequired(this.state.name)}>
                            <FormLabel>Name</FormLabel>
                            <FormControl type="text" value={this.state.name}
                                         onChange={e => this.setState({name: e.target.value})}/>
                        </FormGroup>
                        <FormGroup controlId="section" className="required"
                                   validationState={this.checkRequired(this.state.section)}>
                            <FormLabel>Section</FormLabel>
                            <FormControl type="text" value={this.state.section}
                                         onChange={e => this.setState({section: e.target.value})}/>
                        </FormGroup>
                        <FormGroup controlId="price" className="required"
                                   validationState={this.checkRequired(this.state.price)}>
                            <FormLabel>Price</FormLabel>
                            <FormControl type="text" value={this.state.price}
                                         onChange={e => this.setState({price: e.target.value})}/>
                        </FormGroup>
                        <FormGroup controlId="status">
                            <FormLabel>Status</FormLabel>
                            <FormControl as="select" value={this.state.status}
                                         onChange={e => this.setState({status: e.target.value})}>
                                {this.createSelectItems()}
                            </FormControl>
                        </FormGroup>
                        Select icon
                        <input type="file" onChange={e => this.uploadFile(e)}/>


                        {this.state.isUpdate && <Button type="submit"
                                                        className='float-left'
                                                        bsStyle="danger"
                                                        onClick={(event) => this.deleteService(event)}
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

export class ServicePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            services: [],
            isAdmin: false
        }
    }

    getServices() {
        let url = routes.getServices + `?filter=${this.state.isAdmin ? 'all' : 'Available'}`;
        axios.get(url, Auth.createConfig())
            .then(json => this.setState({services: json.data}))
            .catch(error => console.log(error))
    }

    componentDidMount() {
        Auth.validatePermissions('admin')
            .then(() => this.setState({isAdmin: true}))
            .catch(() => this.setState({isAdmin: false}));
        this.getServices()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isAdmin !== prevProps.isAdmin) {
            this.getServices()
        }
    }

    getService(_id) {
        axios.get(routes.getService + '?id=' + _id, Auth.createConfig())
            .then(json => this.setState({service: json.data, updateService: true}))
            .catch(error => console.log(error))
    }

    render() {

        let services = this.state.services.map((v, i) => <ServiceInfo service={v}
                                                                      onUpdate={(_id) => this.getService(_id)}
                                                                      isAdmin={this.state.isAdmin}
                                                                      key={i}/>);
        if (this.state.isAdmin) {
            services.push(<Card border="dark" style={{width: '19rem', padding: 5, marginLeft: 15, marginTop: 15}}>
                <Card.Img style={{maxHeight: 168}} variant="top" src="not-available.png"/>
                <Card.Body>
                    <Card.Text>
                        <Button onClick={() => this.setState({addService: true})}>Add service</Button>
                    </Card.Text>
                </Card.Body>
            </Card>);
        }

        return (
            <div>
                <NavigationBar/>
                <ServiceAdder show={this.state.addService || this.state.updateService}
                              service={this.state.service}
                              onClose={(status) => {
                                  this.setState({addService: false, updateService: false, service: ''});
                                  status && this.getServices();
                              }}/>
                <div className='Service-page-root d-block mx-auto'>
                    <h3 className='text-center'>Our Services</h3>
                    <div className='row'>
                        {services}
                    </div>
                </div>
            </div>
        );
    }

}
