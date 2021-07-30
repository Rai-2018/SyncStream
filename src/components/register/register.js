import React, { Component } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";

import AuthService from "../../services/auth-service";
import { isEmail } from "validator";
import Avatar from '@material-ui/core/Avatar';
import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

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
    }
  });

const required = value => {
    if(!value) {
        return (
            <Alert severity = "warning">
                This field is required!
            </Alert>
        );
    }
};

const email = value => {
    if(!isEmail(value)) {
        return (
            <Alert severity = "warning">
                This is not a valid email!
            </Alert>
        );
    }
};

const vusername = value => {
    if(value.length < 3 || value.length > 20) {
        return (
            <Alert severity = "warning">
                Username must be between 3-20 characters.
            </Alert>
        );
    }
};

const vpassword = value => {
    if(value.length < 6 || value.length > 40) {
        return (
            <Alert severity = "warning">
                Password must be between 6 and 40 characters.
            </Alert>
        );
    }
};

class Register2 extends Component {
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
                error => {
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
                                <FormControl required fullWidth margin="normal">
                                    <InputLabel htmlFor="username" className={classes.labels}>Username</InputLabel>
                                    <Input 
                                        type='text'
                                        className={classes.inputs}
                                        name='username'
                                        autoComplete="username"
                                        // value={this.state.username}
                                        onChange={this.onChangeUsername}
                                        validations={[required, vusername]}
                                    />
                                </FormControl>

                                <FormControl required fullWidth margin="normal">
                                    <InputLabel htmlFor="email" className={classes.labels}>Email</InputLabel>
                                    <Input 
                                        name='email'
                                        type='email'
                                        autoComplete='email'
                                        className='form-control'
                                        disableUnderline={true}
                                        // value={this.state.email}
                                        className={classes.inputs}
                                        onChange={this.onChangeEmail}
                                        validations={[required, email]}
                                    />
                                </FormControl>

                                <FormControl required fullWidth margin="normal">
                                    <InputLabel htmlFor="password" className={classes.labels}>Password</InputLabel>
                                    <Input 
                                        name='password'
                                        type='password'
                                        className={classes.inputs}
                                        // value={this.state.password}
                                        disabledUnderline={true}
                                        onChange={this.onChangePassword}
                                        validations={[required, vpassword]}
                                    />
                                </FormControl>

                                
                                <Button 
                                    // className="btn btn-primary btn-block"
                                    disableRipple
                                    fullWidth
                                    variant="outlined"
                                    className={classes.button}
                                    type="submit"
                                >
                                    Sign Up
                                </Button>
                                
                            </div>
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

export default withStyles((theme)=>styles(theme))(Register2);
