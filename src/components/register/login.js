import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types'
import Form from "react-validation/build/form";
import Alert from '@material-ui/lab/Alert';

import AuthService from "../../services/auth-service";
import CheckButton from "react-validation/build/button";


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
            <div className = "alert alert-danger" role = "alert">
                This field is required!
            </div>
        );
    }
};

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            password: "",
            loading: false,
            message: "",
        };
    }

    onChangeUsername(e) {
        console.log(this.state.username)
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleLogin(e) {
        e.preventDefault();
        this.setState({
            message: "",
            loading: false
        });
        this.form.validateAll();
        if(this.checkBtn.context._errors.length === 0) {
            console.log("entered login");
            AuthService.login(
                this.state.username,
                this.state.password
            )
            .then(
                () => {
                    this.props.history.push("/create");
                    window.location.reload();
                },
                error => {
                    const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }

  render(){
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs" className={classes.container}>
        <CssBaseline />
        <div className={classes.paper}>
  
          <Form className={classes.form} onSubmit={this.handleLogin} ref={c => { this.form=c; }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              autoComplete="username"
              autoFocus
              value={this.state.username}
              onChange={this.onChangeUsername}
              validations={[required]}
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
              validations={[required]}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>

          <CheckButton style={{ display: "none" }} ref={c => { this.checkBtn = c; }} />
          {this.state.message && (
              <div>
                  <Alert severity="error">
                      {this.state.message}
                  </Alert>
              </div>
          )}          

          </Form>
        </div>
      </Container>
    );
  }
}

// export default SignIn


SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles((theme)=>styles(theme))(SignIn);

// export default withStyles(useStyles)(SignIn)
