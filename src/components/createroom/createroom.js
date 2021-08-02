import {React,Component} from 'react';
import {Button,CssBaseline, TextField, withStyles, Container, Typography  } from '@material-ui/core';
import PropTypes from 'prop-types'
import Alert from '@material-ui/lab/Alert';

import AuthService from "../../services/auth-service";
import {Redirect} from 'react-router';

const styles = (theme) => ({
  userInfo: {
    alignItems: "left",
    marginTop: theme.spacing(3),
  },
  infoTitle: {
    width: '100%',
    maxWidth:360,
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 'bold',
    fontFamily:['Monospace','cursive']
  },
  infoBody: {
    width: '80%',
    display: 'flex',
    
    marginLeft: 20,
    flexDirection: 'column',
    fontFamily:['Consolas','cursive'],
    fontSize: 14,
  },
  inlineRole: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily:['Consolas','cursive'],
    fontSize: 14,
  },
  paper: {
    marginTop: theme.spacing(3),
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
    width: '50ch',
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

const required = value => {
    if(!value) {
        return (
            <div className = "alert alert-danger" role = "alert">
                This field is required!
            </div>
        );
    }
};

class CreateRoom extends Component {
    constructor(props) {
        super(props);
        this.handleRandomGen = this.handleRandomGen.bind(this);
        this.handleGenerateTextChange = this.handleGenerateTextChange.bind(this);
        this.handleGenerate = this.handleGenerate.bind(this)
        this.handleJoinTextChange = this.handleJoinTextChange.bind(this);
        this.handleJoin = this.handleJoin.bind(this);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {username: ""},
            GenerateText: '',
            JoinText:'',
            generate:'',
            err:'',
            roomid:0
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        if(!currentUser) {
            this.setState({ redirect: "/home" });
        }

        this.setState({ currentUser: currentUser, userReady: true })
    }


    handleGenerateTextChange(event) {
        this.setState({ GenerateText: event.target.value })
    }

    handleJoinTextChange(event) {
        this.setState({ JoinText: event.target.value })
    }

    handleGenerate() {
        var self = this;

        this.setState({ generate: true });
        if(this.state.GenerateText === "" || (this.state.GenerateText.split(/\W+/).length > 1) ){
            this.setState({err:'Room name invalid'})
            return;
        }

        fetch(`http://${process.env.REACT_APP_URL}:4000/cr`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.currentUser.username,
                roomname: this.state.GenerateText,
                room_id: new Date().getTime()
            })
        })
          .then(response => response.json())
          .then(function(data){
            if(data.message === "duplicate"){
                self.setState({err:'Room with same name already exist, try another room name!'})
            } else {
                self.setState({ roomid: data.message  });
                self.setState({ redirect: "/room/" + data.message  });
            }
          })
    }

    handleRandomGen() {
        const changename = this
        fetch(`http://${process.env.REACT_APP_URL}:4000/random`, {
            method:'GET',
        })
          .then(response => response.json())
          .then(function(data){
                changename.setState({ GenerateText: data.message[0] })
            });
    }

    handleJoin() {
        var self = this;
        this.setState({ generate: true });
        fetch(`http://${process.env.REACT_APP_URL}:4000/jr`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.currentUser.username,
                roomname: this.state.JoinText,
                room_id: new Date().getTime()
            })
        })
          .then(response => response.json())
          .then(function(data){
            if(data.message === "nonexist"){
                self.setState({err:'Room does not exist'})
            } else {
                self.setState({ roomid: data.message  });
                self.setState({ redirect: "/room/" + data.message  });
            }
          })
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to={{
                    pathname:this.state.redirect,
                    state: { room_id: this.state.roomid }

                    }} 
                    />
        }

        const { classes } = this.props;
        const {currentUser} = this.state;


        return (

            <Container component="main" maxWidth="xs" className={classes.container}>
              
                <CssBaseline />
                <Typography className={classes.userInfo} >                
                  <Typography component={'span'} className={classes.infoTitle} >
                    Welcome, {currentUser.username}
                  </Typography>
                  <Typography component={'span'} className={classes.infoTitle} >
                    Email: 
                  </Typography>
                  <Typography component={'span'} className={classes.infoBody}>
                    {currentUser.email}
                  </Typography>
                  <Typography component={'span'} className={classes.infoTitle} >
                    Authorities:
                  </Typography>
                  <Typography component={'span'} className={classes.infoBody}>
                    {currentUser.roles && currentUser.roles.map((role, index) => 
                      <Typography component={'span'} className={classes.inlineRole} key={index}>
                        {role}
                      </Typography>
                    )}
                  </Typography>
                </Typography>
                <div className={classes.paper}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="RoomName1"
                        label="Room Name"
                        name="Room Name"
                        autoComplete="Room Name"
                        size="small"
                        autoFocus
                        validations={[required]}
                        onChange={this.handleGenerateTextChange} 
                        value={this.state.GenerateText}
                    />
                    
                    <div>
                        <Button 
                          display="inline"
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          onClick = {this.handleGenerate}
                        >
                          Create
                        </Button>
                        <Button                          
                          display="inline"                        
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
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="RoomName2"
                        label="Room Name"
                        name="Room Name"
                        autoComplete="Room Name"
                        size="small"
                        autoFocus
                        validations={[required]}
                        onChange={this.handleJoinTextChange} 
                        value={this.state.JoinText}
                        className={classes.input}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick = {this.handleJoin}
                    >
                      Join
                    </Button>

                    &nbsp;

                  {this.state.generate && (
                      <div>
                          <Alert severity="error">
                              {this.state.err}
                          </Alert>
                      </div>
                  )}   
                </div>
            </Container>
        )
    }
}

CreateRoom.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles((theme)=>styles(theme))(CreateRoom);