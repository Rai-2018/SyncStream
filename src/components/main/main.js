import {React,Component} from 'react';
import {Player} from '../video/video';
import Upload from '../upload/upload';
import Chatbox from '../chatbox/Chat';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types'

import {withStyles } from '@material-ui/core/styles';
import AuthService from "../../services/auth-service";

const styles = (theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    }
});


class Main extends Component {

    constructor(props) {
      super(props);
      this.state = {
            redirect: null,
            userReady: false,
            currentUser: {username: ""},
            room_id: 0,
            roomReady: false,
      };
    }

    componentDidMount(props) {
        const currentUser = AuthService.getCurrentUser();
        if(!currentUser) {
          this.setState({ redirect: "/home" });
        }

        this.setState({ currentUser: currentUser, userReady: true })
        this.setState({ room_id: this.props.room_id, roomReady: true })
    }

    render(){
        const {classes} = this.props;

        return (

            <div className={classes.root}> 
                {(this.state.userReady && this.state.roomReady) ?

                    <Grid container spacing={3}>
                        <Grid item xs={8}>
                        <Paper className={classes.paper}>
                            <Player room_id={this.state.room_id} user_id={this.state.currentUser.username}/>
                            <Upload />
                        </Paper>
                        </Grid>
                        <Grid item xs={4}>
                        <Paper className={classes.paper}>
                            <Chatbox />
                        </Paper>
                        </Grid>
                    </Grid> 

                    :

                    null}
                }

            </div>      
        )
    }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles((theme)=>styles(theme))(Main);