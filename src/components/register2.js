import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types'
import Form from "react-validation/build/form";
import Alert from '@material-ui/lab/Alert';

import AuthService from "../services/auth-service";
import CheckButton from "react-validation/build/button";

import { isEmail } from "validator";

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
    console.log(value)
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
                                <div>

                                  <TextField 
                                    variant="outlined"
                                      margin="normal"
                                      required
                                      fullWidth
                                      name="username"
                                      label="Username"
                                      type="username"
                                      id="username"
                                      autoComplete="current-username"
                                      value={this.state.username}
                                      onChange={this.onChangeUsername}
                                      validations={[required,vusername]}
                                />
                                {/* <TextValidator
                                    label="Email"
                                    onChange={this.onChangeEmail}
                                    name="email"
                                    value={email}
                                    validators={['required', 'isEmail']}
                                    errorMessages={["this field is required", "email is not valid"]} /> */}

                                <TextField 
                                    variant="outlined"
                                      margin="normal"
                                      required
                                      fullWidth
                                      name="email"
                                      label="Email"
                                      type="email"
                                      id="email"
                                      autoComplete="current-email"
                                      value={this.state.email}
                                      onChange={this.onChangeEmail}
                                      validations={[required,vemail]}
                                />

                                <TextField 
                                    variant="outlined"
                                      margin="normal"
                                      required
                                      fullWidth
                                      name="password"
                                      label="Password"
                                      type="password"
                                      id="password"
                                      autoComplete="current-password"
                                      value={this.state.password}
                                      onChange={this.onChangePassword}
                                      validations={[required,vpassword]}
                                />
                                
                                <Button
                                  type="submit"
                                  fullWidth
                                  variant="contained"
                                  color="primary"
                                  className={classes.submit}
                                >
                                  Sign up
                                </Button>
                                <CheckButton style={{ display: "none" }} ref={c => { this.checkBtn = c; }} />

                            </div>
                        )}
                        {this.state.message && (
                            <div className="form-group">
                                <Alert 
                                    severity={this.state.successful?"success":"error"}>
                                    {this.state.message}
                                </Alert>
                                <CheckButton style={{ display: "none" }} ref={c => { this.checkBtn = c; }} />

                            </div>
                        )}
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