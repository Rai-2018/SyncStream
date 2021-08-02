import {React,Component} from 'react';
import {Button,CssBaseline, TextField} from '@material-ui/core';
import {withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types'
import Alert from '@material-ui/lab/Alert';
import AuthService from "../../services/auth-service";
import {Redirect} from 'react-router';
import UserService from "../../services/user-service";
import DataTable from "./data-table";
import axios from "axios";

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
  
const required = value => {
    if(!value) {
        return (
            <div className = "alert alert-danger" role = "alert">
                This field is required!
            </div>
        );
    }
};
  
export default class BoardAdmin extends Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            userCollection: [],
            content: "", 
            users: null
        };
    }
    componentDidMount() {
        // UserService.getAdminBoard().then(
        //     response => {
        //         this.setState({ content: response.data });
        //     },

        //     error => {
        //         this.setState({ content: (error.response && error.response.data && error.response.data.message) || error.message || error.toString() });
        //     }
        // );
        axios.get(`http://${process.env.REACT_APP_URL}:4000/admin/allusers`).then(res=>{
            this.setState({ userCollection: res.data });

        }).catch(function(error){
            console.log(error);
        });
    }

    dataTable() {
        return this.state.userCollection.map((data, i) => {
            return <DataTable obj={data} key={i} />;
        });
    }

    render() {
        const{users}=this.state

        return (
            <div>
                <header>
                    <h2>Admin</h2>
                    
                    
                </header>
                <p>This page can only be accessed by administrators</p>
                <br />
                    <div>
                        All users from secure (admin only) api end point:
                        
                    </div>
                <p>hello</p>
                <p>{this.state.content}</p>
                <div className="container">
                    <table className="table table-striped table-dark">
                        <thead className="thead-dark">
                            <tr>
                                <td>ID</td>
                                <td>Name</td>
                                <td>email</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.dataTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}