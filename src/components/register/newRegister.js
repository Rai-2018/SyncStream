import React, { Component } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { ValidatorForm } from "react-material-ui-form-validator";
import AuthService from "../../services/auth-service";
import { isEmail } from "validator";
import Avatar from '@material-ui/core/Avatar';
import { Button, FormControl, Input, InputLabel, OutlinedInput } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import { TextValidator, ValidatorComponent } from "react-material-ui-form-validator";

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

class Register2 extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        if(!ValidatorForm.hasValidationRule('isUsernameRight')) {
            ValidatorForm.addValidationRule('isUsernameRight', (value) =>{
                if(value.length < 6 || value.length > 40) {
                    return false;
                }
                return true;
            });
        }
        if(!ValidatorForm.hasValidationRule('isPasswordRight')) {
            ValidatorForm.addValidationRule('isPasswordRight', (value) =>{
                if(value.length < 6 || value.length > 40) {
                    return false;
                }
                return true;
            });
        }
        
        this.state = {
            username: "",
            email: "",
            password: "",
            successful: false,
            message: "",
            submitted: false,
        };
    }

    componentWillUnmount(){
        if(ValidatorForm.hasValidationRule('isUsernameRight')){
            ValidatorForm.removeValidationRule('isUsernameRight');
        }
        if(ValidatorForm.hasValidationRule('isPasswordRight')){
            ValidatorForm.removeValidationRule('isPasswordRight');
        }
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
        //this.form.validateAll();
        const {submitted} = this.state.submitted;

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
            }
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs" className={classes.container}>
                <CssBaseline />
                    <div className={classes.paper}>     
                    <ValidatorForm ref="form" onSubmit={this.handleRegister} >
                        {!this.state.successful && (
                            <div>
                                <TextValidator 
                                    label="Username"
                                    name='username'
                                    value={this.state.username}
                                    onChange={this.onChangeUsername}
                                    validators={['required', 'isUsernameRight']}
                                    errorMessages={'This field is required', 'Username must be between 3-20 characters.'}
                                    
                                    // 
                                />
                                <br />
                                <TextValidator 
                                    name='email'
                                    label='email'
                                    // autoComplete='email'
                                    value={this.state.email}
                                    
                                    // className={classes.inputs}
                                    onChange={this.onChangeEmail}
                                    validators={['required', 'isEmail']}
                                    errorMessages={'This field is required', 'This is not a valid email!'}
                                />
                                <br />
                                <TextValidator 
                                    name='password'
                                    label='password'
                                    className={classes.inputs}
                                    // value={this.state.password}
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                    validators={['required', 'isPasswordRight']}
                                    errorMessages={'This field is required', 'Password must be between 6 and 40 characters.'}
                                />
                                <br />
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
                            <div className={this.state.successful?"alert alert-success":"alert alert danger"}>
                                {this.state.message}
                            </div>
                        )}
                        

                    </ValidatorForm>
                </div>
            </Container>
        );
    }
}

export default withStyles((theme)=>styles(theme))(Register2);