import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';


import AuthService from './services/auth-service';
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';
import Profile from './components/profile';
import BoardUser from './components/board-user';
import BoardModerator from './components/board-moderator';
import BoardAdmin from './components/board-admin';
import {Player as VideoPlayer} from './components/video/video';
import Upload from './components/upload/upload';
import Chatbox from './components/chatbox/chatbox';
import Main from './components/main/main';
import SignIn from './components/loginr';

import green from '@material-ui/core/colors/green';
import AppBar from "@material-ui/core/AppBar"
import { IconButton , Toolbar, makeStyles, Typography, Button} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}


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
    
    const { classes } = this.props;
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

{/*            {currentUser !==  undefined && (
              <IconButton color="inherit" align="center">
                <Link to={"/user"} className="nav-link">User</Link>
              </IconButton>
            )}*/}

          {
            currentUser ? (
              <React.Fragment>

                <Button color="inherit" color="green" variant="contained">
                  <Link to={"/main"} >
                    Main
                  </Link>
                </Button>

                &nbsp;
                &nbsp;
                
                <Button color="inherit" color="green" variant="contained">
                  <Link to={"/profile"} className="nav-link">{ currentUser.username }</Link>
                </Button>

                &nbsp;
                &nbsp;
                <Button color="inherit" color="green" variant="contained">
                  <a href="/login" className="nav-link" onClick={this.logOut}>Log Out</a>
                </Button>
                
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button color="inherit" color="green" variant="contained">
                  <Link to={"/login"} className="nav-link">Login</Link>
                </Button>
                &nbsp;
                &nbsp;
                <Button color="inherit" color="green" variant="contained">
                  <Link to={"/register"} className="nav-link">Sign Up</Link>
                </Button>
                
              </React.Fragment>
            )
          }
        </Toolbar>
        </AppBar>


        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Login} />
            <Route exact path={"/login"} component={Login} />
            <Route exact path={"/register"} component={Register} />
            <Route exact path={"/profile"} component={Profile} />
            <Route exact path={"/user"} component={BoardUser} />
            <Route exact path={"/mod"} component={BoardModerator} />
            <Route exact path={"/admin"} component={BoardAdmin} />
            <Route exact path='/video' component={VideoPlayer}/>
            <Route exact path='/upload' component={Upload}/>
            <Route exact path='/chat' component={Chatbox}/>
            <Route exact path='/main' component={Main}/>
            <Route exact path='/loginr' component={SignIn}/>

          </Switch>
        </div>
        
      </React.Fragment>
    );
  }
}

export default App;
// export default withStyles(useStyles)(App)
