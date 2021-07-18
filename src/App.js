import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { withStyles } from '@material-ui/styles';
// import './App.css';
import AppBar from "@material-ui/core/AppBar"
import IconButton from '@material-ui/core/IconButton';
import AuthService from './services/auth-service';
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';
import Profile from './components/profile';
import BoardUser from './components/board-user';
import BoardModerator from './components/board-moderator';
import BoardAdmin from './components/board-admin';
import { makeStyles, Typography } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import {Player as VideoPlayer} from './components/video/video';
import Upload from './components/upload/upload';
import Chatbox from './components/chatbox/chatbox';
import Main from './components/main/main';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  customColor: {
    backgroundColor: green[500]
  },
  customHeight: {
    minHeight: 200
  },
  offset: theme.mixins.toolbar
}));


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
          <Typography component="h1" variant="h1" className={classes.title} align="center">
            Sync Stream
          </Typography>
          

          <IconButton color="inherit">
            <Link to={"/home"} >
              Home
            </Link>
          </IconButton>

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
            {currentUser && (
              <IconButton color="inherit" align="center">
                <Link to={"/user"} className="nav-link">User</Link>
              </IconButton>
            )}

          {currentUser ? (
            
            <React.Fragment>
              <IconButton color="inherit">
                <Link to={"/profile"} className="nav-link">{ currentUser.username }</Link>
              </IconButton>
              
              <IconButton color="inherit">
                <a href="/login" className="nav-link" onClick={this.logOut}>Log Out</a>
              </IconButton>
              
            </React.Fragment>
          ) : (
            <React.Fragment>
              <IconButton color="inherit">
                <Link to={"/login"} className="nav-link">Login</Link>
              </IconButton>

              <IconButton color="inherit">
                <Link to={"/register"} className="nav-link">Sign Up</Link>
              </IconButton>
              
            </React.Fragment>
          )}

        </AppBar>
        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
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

          </Switch>
        </div>
        
      </React.Fragment>
    );
  }
}

// export default App;
export default withStyles(useStyles)(App)
