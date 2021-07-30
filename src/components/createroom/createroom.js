import {React,Component} from 'react';
import {Button,CssBaseline, TextField, Checkbox} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types'
import Alert from '@material-ui/lab/Alert';


import AuthService from "../../services/auth-service";
import {Redirect} from 'react-router';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  input:{
    width: '50ch',
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    width: '25ch',
    marginTop: theme.spacing(1),
  },
  join: {
    width: '50ch',
    marginTop: theme.spacing(1),
  },
  container: {
    marginTop: theme.spacing(1),
  }
});


class CreateRoom extends Component {
    constructor(props) {
        super(props);
        this.handleRandomGen = this.handleRandomGen.bind(this);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {username: ""}
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        if(!currentUser) {
            this.setState({ redirect: "/home" });
        }

        this.setState({ currentUser: currentUser, userReady: true })
    }

    handleRandomGen() {
        fetch('http://names.drycodes.com/1', {
            method:'GET',
        })
          .then(response => response.json())
          .then(data => console.log(data));
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        const { classes } = this.props;
        return (

            <Container component="main" maxWidth="xs" className={classes.container}>
                <CssBaseline />
                <div className={classes.paper}>
                    <TextField id="outlined-basic" label="Room Name" variant="outlined" className={classes.input} size="small"/>
                    <div>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          className={classes.button}
                        >
                          Create
                        </Button>
                        &nbsp;
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          onClick = {this.handleRandomGen}
                        >
                          Generate
                        </Button>
                    </div>
                    &nbsp;

                    <TextField id="outlined-basic" label="Room Name" variant="outlined" className={classes.input} size="small"/>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Join
                    </Button>

                    &nbsp;
                </div>
            </Container>
        )
    }
}

CreateRoom.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles((theme)=>styles(theme))(CreateRoom);