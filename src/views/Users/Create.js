import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';
import ApiErrorCard from '../ApiErrorCard';
import { getApiErrorMessages, isUnauthenticatedError } from '../../helpers/apiErrorMessages';

class Create extends Component {
    state = {
        resource: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
        resource_unchanged: true,
        creating_resource: false
    };

    constructor(props) {
        super(props);

        this.updateInputValue = this.updateInputValue.bind(this);
        this.handleCreateResource = this.handleCreateResource.bind(this);
    }

    updateInputValue(evt) {
        if(this.state.resource_unchanged === true) {
            this.setState({
                resource_unchanged: false,
            });
        }
        this.setState({
            resource: {
                ...this.state.resource,
                [evt.target.name]: evt.target.value,
            }
        });
    }

    handleCreateResource(evt) {
        evt.preventDefault();

        const { createResource, token } = this.props;
        const { resource } = this.state;
        const data = { token, ...resource };

        this.setState({
            creating_resource: true
        });

        createResource({ data });
    }

    componentDidMount() {
        //
    }

    componentDidUpdate(prevProps) {
        const {
            errors,
            created,
            history,
            resource,
            unauthenticated
        } = this.props;

        // if unauthenticated redirect to login
        if(prevProps.unauthenticated === false && unauthenticated === true) {
            this.props.loggedOut();
        }

        // If I am receiving errors and I am creating the resource
        // Set the creating resource to false
        else if(errors.length !== 0 && this.state.creating_resource === true) {
            this.setState({
                creating_resource: false
            });
        }

        // If received created=true and resource id is there
        // Redirect to resource edit
        else if(
            prevProps.created !== true
            && created === true
            && typeof resource.id !== 'undefined'
        ) {
            history.push('/users/'+resource.id);
        }
    }

    componentWillUnmount() {
        this.props.clearMetadataResourceCreate();
    }

    render() {
        const { errors } = this.props;
        const {
            creating_resource,
            resource,
            resource_unchanged
        } = this.state;

        // console.log('resource', resource);
        // console.log('resource_unchanged', resource_unchanged);
        // console.log('creating_resource', creating_resource);

        let createButtonIconClassName = "fa fa-plus";
        if(creating_resource === true) {
            createButtonIconClassName = "fa fa-spinner fa-spin";
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col md="12">
                        <ApiErrorCard errors={errors} />
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Card className="card-accent-success">
                            <CardHeader className="h1">
                                <strong>Create Resource</strong>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={this.handleCreateResource}>
                                    <FormGroup>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={resource.name}
                                            placeholder="Enter your name"
                                            onChange={this.updateInputValue}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={resource.email}
                                            placeholder="Enter your email"
                                            onChange={this.updateInputValue}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={resource.password}
                                            placeholder="Enter your password"
                                            onChange={this.updateInputValue}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                                        <Input
                                            type="password"
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            value={resource.password_confirmation}
                                            placeholder="Confirm your password"
                                            onChange={this.updateInputValue}
                                        />
                                    </FormGroup>
                                    <Button
                                        type="submit"
                                        size="md"
                                        color="success"
                                        block
                                        disabled={resource_unchanged || creating_resource}
                                        onClick={this.handleCreateResource}
                                    >
                                        <i className={createButtonIconClassName}></i>
                                        {' '}
                                        Create
                                    </Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        created,
        error,
        resource
    } = state.users;
    const errors = getApiErrorMessages(error);
    const unauthenticated = isUnauthenticatedError(error);

    return {
        created: created,
        errors: errors,
        resource: typeof resource === 'undefined' ? null : resource,
        token: state.auth.token,
        unauthenticated: unauthenticated
    };
};

const mapDispatchToProps = (dispatch) => ({
    clearMetadataResourceCreate() {
        dispatch({
            type: 'CLEAR_METADATA_USER_CREATE'
        })
    },
    createResource(data) {
        dispatch({
            type: 'CREATE_USER_REQUEST',
            payload: data
        })
    },
    loggedOut(data) {
        dispatch({
            type: 'LOGGED_OUT',
            payload: data
        })
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Create);
