import React, { Component } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import AuthService from "../../services/auth-service";
import { Button, withStyles, CssBaseline, Container, Avatar } from '@material-ui/core';
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import Alert from '@material-ui/lab/Alert';

const styles = (theme) => ({
    paper: {
      position: "relative",
      marginTop: theme.spacing(3),
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      
    },
    avatar: {
      marginTop: 5,
      width: "100px",
      height: "100px",
      position: "relative",
      margin: theme.spacing(1),
      marginBottom: theme.spacing(3)
    },
    icon: {
        width: "70px",
        height: "70px",
    },
    ValidatorForm: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),

    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    container: {
      marginTop: theme.spacing(1),
    },
    TextValidator: {        
        position: "relative",
        width: '100%',
    }
  });

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
            tester: 0
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

    handleSubmit(e){
        e.preventDefault();
        if(this.state.submitted && this.state.successful) {
            this.setState({
                message: "Successfully Registered"
            });
        }
        else {
            this.setState({
                message: "Failed to Register"
            });
        }
    }

    handleRegister(e) {
        e.preventDefault();
        console.log("registering");
        this.setState({
            message: "",
            successful: false
        });

        AuthService.register(
            this.state.username,
            this.state.email,
            this.state.password
        )
        .then(
            response => {
                this.setState({
                    message: response.data.message,
                    successful: true,
                    submitted: true,
                    tester: 0
                },
                
                );
                console.log(typeof(response));
            }
        ).catch(error=>{
            const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            
            this.setState({
                successful: false,
                message: resMessage,
                tester: 1
            });
            
        }); 
       
    }

    render() {
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs" className={classes.container}>
                <CssBaseline />
                    <div className={classes.paper}>     
                    <Avatar className={classes.avatar}>
                        <PeopleAltIcon className={classes.icon} />
                    </Avatar>
                    <ValidatorForm className={classes.ValidatorForm} ref="form" onSubmit={this.handleRegister} >
                        {!this.state.successful && !this.state.submitted && (
                            <div>

                                <TextValidator className={classes.TextValidator}
                                    autoFocus
                                    variant="outlined"
                                    label="Username"
                                    name='username'
                                    type="username"
                                    value={this.state.username}
                                    onChange={this.onChangeUsername}
                                    fullWidth
                                    validators={['isUsernameRight', 'required']}
                                    errorMessages={['Username must be between 3-20 characters.', 'This field is required']} 
                                />
                                <br />
                                <TextValidator 
                                    variant="outlined"
                                    name='email'
                                    type='email'
                                    label='email'
                                    value={this.state.email}
                                    fullWidth
                                    onChange={this.onChangeEmail}
                                    validators={['required', 'isEmail']}
                                    errorMessages={['This field is required', 'This is not a valid email!']}
                                />
                                <br />
                                <TextValidator 
                                    variant="outlined"
                                    name='password'
                                    label='password'
                                    type="password"
                                    className={classes.inputs}
                                    fullWidth
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                    validators={['isPasswordRight','required']}
                                    errorMessages={['Password must be between 6 and 40 characters.', 'This field is required']}
                                />
                                <br />
                                <Button 
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
                        
                        
                        {(this.state.successful && this.state.tester === 0) && (
                            <Alert severity="success">
                                Successfully Registered
                            </Alert>
                        )}

                        {(!this.state.successful && this.state.tester === 1) && (

                            <Alert severity="error">
                                {this.state.message}
                            </Alert>
                        )}
                        
                    </ValidatorForm>
                </div>
            </Container>
        );
    }
}

export default withStyles((theme)=>styles(theme))(Register2);