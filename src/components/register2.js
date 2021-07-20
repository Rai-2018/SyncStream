import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
// import {ValidatorForm, TextValidator} from "react-material-ui-form-validator"
import AuthService from "../services/auth-service";
import { isEmail } from "validator";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

const styles = (theme) => ({
    paper: {
      marginTop: theme.spacing(5),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    container: {
      marginTop: theme.spacing(1),
    },
    input: {
        marginTop: theme.spacing(3),
    }
  });

const required = value => {
    if(!value) {
        return (
            <div>
                This field is required!
            </div>
        );
    }
};

const vemail = value => {
    if(value === ""){
        return (<div>email cannot be empty</div>);
    }
    if(!isEmail(value)) {
        return (
            <div>
                This is not a valid email!
            </div>
        );
    }
};

const vusername = value => {
    if(value === ""){
        return (<div>username cannot be empty</div>);
    }
    if(value.length < 3 || value.length > 20) {
        return (
            <div>
                Username must be between 3-20 characters.
            </div>
        );
    }
};

const vpassword = value => {
    console.log(value);
    if(value === ""){
        return (<div>password cannot be empty</div>);
    }
    if(value.length < 6 || value.length > 40) {
        return (
            <div>
                Password must be between 6 and 40 characters.
            </div>
        );
        
    }
};

// const validate = {
//     username: name => vusername(name),
//     emimail
// }

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            email: "",
            password: "",
            successful: false,
            message: "",
        };
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }
    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }
    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleRegister(e) {
        e.preventDefault();
        console.log("registering");
        this.setState({
            message: "",
            successful: false
        });
        this.form.validateAll();
        if(this.checkBtn.context._errors.length === 0) {

            AuthService.register(
                this.state.username,
                this.state.email,
                this.state.password
            )
            .then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true
                    });
                },
                (error) => {
                    const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                    this.setState({
                        successful: false,
                        message: resMessage
                    });
                }
            );
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs" className={classes.container}>
                <CssBaseline />
                <div className={classes.paper}>
                    
                    <Form className={classes.form} onSubmit={this.handleRegister} ref={c => { this.form=c; }}>
                        {!this.state.successful && (
                            <React.Fragment>
                                <TextField 
                                    className={classes.input}
                                    autoComplete="username"
                                    name="username"
                                    variant="outlined"
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoFocus 
                                    value={this.state.username}
                                    onChange={this.onChangeUsername}
                                    validations={[require, vusername]}
                                />
                                {/* <TextValidator
                                    label="Email"
                                    onChange={this.onChangeEmail}
                                    name="email"
                                    value={email}
                                    validators={['required', 'isEmail']}
                                    errorMessages={["this field is required", "email is not valid"]} /> */}

                                <TextField 
                                    className={classes.input}
                                    autoComplete="email"
                                    name="email"
                                    variant="outlined"
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    autoFocus 
                                    value={this.state.email}
                                    onChange={this.onChangeEmail}
                                    validations={[require,vemail]}
                                />

                                <TextField 
                                    className={classes.input}
                                    autoComplete="password"
                                    name="password"
                                    variant="outlined"
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    autoFocus 
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                    validations={[require,vpassword]}
                                />
                                
                                <Button 
                                    className={classes.input}
                                    type="submit"
                                    fullwidith
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Sign Up
                                </Button>
                            </React.Fragment>
                        )}
                        {this.state.message && (
                            <div className="form-group">
                                <Alert 
                                    severity={this.state.successful?"success":"error"}>
                                    {this.state.message}
                                </Alert>
                            </div>
                        )}
                        <CheckButton style={{ display: "none" }} ref={c => { this.checkBtn = c; }} />
                    </Form>
                </div>
            </Container>
        );
    }
}

Register.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles((theme)=>styles(theme))(Register);