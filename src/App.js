import React from 'react';
import { Switch, Route, Link, BrowserRouter as Router} from 'react-router-dom';


import AuthService from './services/auth-service';

import Register from './components/register/register';
import Profile from './components/register/profile';
import BoardUser from './components/register/board-user';
import BoardModerator from './components/register/board-moderator';
import BoardAdmin from './components/register/board-admin';
import SignIn from './components/register/login';

import {Player as VideoPlayer} from './components/video/video';

import Upload from './components/upload/upload';
import Chatbox from './components/chatbox/Chat';
import Main from './components/main/main';

import CreateRoom from './components/createroom/createroom';
import Room from './components/createroom/room';

import AppBar from "@material-ui/core/AppBar"
import { IconButton , Toolbar, Typography, Button} from '@material-ui/core';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
        currentUser: undefined,
        showModeratorBoard: false,
        showAdminBoard: false,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if(user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }
  
  
  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    
    return (
      <React.Fragment>
        <AppBar position="static">
          <Typography component="h3" variant="h3" align="center">
            Sync Stream
          </Typography>
  
          <Toolbar>

            {showModeratorBoard && (
              <IconButton color="inherit">
                  <Link to={"/mod"} className="nav-link">Moderator Board</Link>
              </IconButton>
              
            )}

            {showAdminBoard && (
              <IconButton color="inherit">
                  <Link to={"/admin"} className="nav-link">Admin Board</Link>
              </IconButton>
            )}


          {
            currentUser ? (
              <React.Fragment>

                <Button color="inherit" variant="contained">
                  <Link to={"/main"} >
                    Main
                  </Link>
                </Button>

                &nbsp;
                &nbsp;
                
                <Button color="inherit" variant="contained">
                  <Link to={"/profile"} className="nav-link">{ currentUser.username }</Link>
                </Button>

                &nbsp;
                &nbsp;
                <Button color="inherit" variant="contained">
                  <a href="/login" className="nav-link" onClick={this.logOut}>Log Out</a>
                </Button>
                
                  &nbsp;
                &nbsp;
                <Button color="inherit" variant="contained">
                  <a href="/create" className="nav-link">Create</a>
                </Button>

              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button color="inherit" variant="contained">
                  <Link to={"/login"} className="nav-link">Login</Link>
                </Button>
                &nbsp;
                &nbsp;
                <Button color="inherit" variant="contained">
                  <Link to={"/register"} className="nav-link">Sign Up</Link>
                </Button>
                
              </React.Fragment>
            )
          }
        </Toolbar>
        </AppBar>


        <div className="container mt-3">
        <Switch>
            <Route exact path={["/", "/home"]} component={SignIn} />
            <Route exact path={"/login"} component={SignIn} />
            <Route exact path={"/register"} component={Register} />
            <Route exact path={"/profile"} component={Profile} />
            <Route exact path={"/create"} component={CreateRoom} />} />
            <Route exact path={"/user"} component={BoardUser} />
            <Route exact path={"/mod"} component={BoardModerator} />
            <Route exact path={"/admin"} component={BoardAdmin} />
            <Route exact path='/video' component={VideoPlayer}/>
            <Route exact path='/upload' component={Upload}/>
            <Route exact path='/chat' component={Chatbox}/>
            <Route exact path='/main' component={Main}/>
            <Route path='/room/:roomid' render={(props) => <Room {...props}/>}/>
        </Switch>
        </div>
        
      </React.Fragment>
    );
  }
}

export default App;
// export default withStyles(useStyles)(App)
