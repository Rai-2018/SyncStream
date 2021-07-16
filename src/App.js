import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { withStyles } from '@material-ui/styles';
import './App.css';
import AppBar from "@material-ui/core/AppBar"
import AuthService from './services/auth-service';
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';
import Profile from './components/profile';
import BoardUser from './components/board-user';
import BoardModerator from './components/board-moderator';
import BoardAdmin from './components/board-admin';
import { makeStyles, Typography } from '@material-ui/core';
import {Player as VideoPlayer} from './components/video/video';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  }
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
      <div>
        <AppBar position="static">
          <Typography variant="h2" className={classes.title}>
            <Link to={"/"}>Sync Stream</Link>
          </Typography>
          
          <div className="navbar-nav">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">Moderator Board</Link>
              </li>
            )}
            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">Admin Board</Link>
              </li>
            )}
            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">User</Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">{ currentUser.username }</Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>Log Out</a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to={"/register"} className="nav-link">Sign Up</Link>
              </li>
            </div>
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

          </Switch>
        </div>
        
      </div>
    );
  }
}

// export default App;
export default withStyles(useStyles)(App)
