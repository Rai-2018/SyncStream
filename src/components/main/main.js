import {React,Component} from 'react';
import {Player} from '../video/video';
import Upload from '../upload/upload';
import Chatbox from '../chatbox/Chat';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types'
import {withStyles } from '@material-ui/core/styles';
import AuthService from "../../services/auth-service";

const styles = (theme) => ({
    root: {
      flexGrow: 1,
    }
});


class Main extends Component {

    constructor(props) {
      super(props);
      this.updateShared = this.updateShared.bind(this)
      this.state = {
            redirect: null,
            userReady: false,
            currentUser: {username: ""},
            room_id: 0,
            roomReady: false,
        useNewUrlParser: true, 
            shared_var: `http://${process.env.REACT_APP_URL}:4000/video/default.mp4`,
            changed: 0
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


    updateShared(shared_value) {
        this.setState({shared_var: shared_value});
        this.setState({changed: 1});
    }

    render(){
        const {classes} = this.props;

        return (
            <div className={classes.root}> 
                {(this.state.userReady && this.state.roomReady) ?
                <div>
                    <div style={{ width: '100%' }}>
                        <Box display="flex" flexDirection="row" p={1} m={1} bgcolor="background.paper">
                            <Box  width='80%' bgcolor="white">
                                <Player room_id={this.state.room_id} user_id={this.state.currentUser.username} 
                                                    shared_var={this.state.shared_var} changed={this.state.changed}/> 
                            </Box>  
                            <Box  width='40%' bgcolor="white">
                                <Chatbox room_id={this.state.room_id} user_id={this.state.currentUser.username} /> 
                            </Box>  
                        </Box>
                    </div>
                    <div style={{ width: '100%' }}>
                        <Upload updateShared={this.updateShared} shared_var={this.state.shared_var}
                                        room_id={this.state.room_id} user_id={this.state.currentUser.username}/>
                    </div>
                  </div>
                    :
                    null}
            </div>      
        );
    }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles((theme)=>styles(theme))(Main);