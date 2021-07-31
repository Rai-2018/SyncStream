import {React,Component} from 'react';
import {withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import Main from '../main/main'
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


class Room extends Component {

  constructor(props) {
      super(props);

      this.state = {
          redirect: null,
          userReady: false,
          currentUser: {username: ""},
          queryText: '',
          generate:'',
          err:'',
          room_id: null,
          roomReady: false
      };
  }

  componentDidMount(props) {
      const currentUser = AuthService.getCurrentUser();
      if(!currentUser) {
          this.setState({ redirect: "/home" });
      }

      this.setState({ currentUser: currentUser, userReady: true })
      this.setState({ room_id: this.props.location.state.room_id, roomReady:true})
  }

	render(){
    const {classes} = this.props;
    const {currentUser} = this.state;

		return(
      <div>
        {(this.state.userReady && this.state.roomReady) ? <Main room_id={this.state.room_id} />   : null}
      </div>

    )
	}
}

Room.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles((theme)=>styles(theme))(Room);