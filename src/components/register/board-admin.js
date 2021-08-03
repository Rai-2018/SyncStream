import {React,Component} from 'react';
import {Button, CardHeader, Container, CssBaseline, Paper, Table, TableBody, TableCell, TableHead, TableRow, withStyles,  } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from "axios";

const styles = (theme) => ({
    alert: {
      spacing: theme.spacing(2),
    },
    paper: {
      marginTop: theme.spacing(5),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    button: {
      width: '25ch',
      marginTop: theme.spacing(1),
    },
    container: {
      marginTop: theme.spacing(1),
    }
});
  
class BoardAdmin extends Component {
    
    constructor(props) {
        super(props);
        this.deleteUser = this.deleteUser.bind(this);

        this.state = { 
            userCollection: {users: []},
            content: "", 
            users: null
        };
    }

    componentDidMount() {
        axios.get(`http://${process.env.REACT_APP_URL}:4000/admin/allusers`).then(res=>{
            this.setState({ userCollection: res.data });

        }).catch(function(error){
            console.log(error);
        });
    }

    deleteUser(id) {
        axios.post(`http://${process.env.REACT_APP_URL}:4000/admin/delete`, {id: id})
        .then( res => {
            axios.get(`http://${process.env.REACT_APP_URL}:4000/admin/allusers`).then(res=>{
                this.setState({ userCollection: res.data });

            }).catch(function(error){
                console.log(error);
            });

        }).catch(function(error){
            console.log(error);
        });
    }

    dataTable() {
        const { classes } = this.props;
        return this.state.userCollection.users.map((data, i) => {

            return (
                <TableRow key={data._id}>
                    <TableCell>
                        {data._id}
                    </TableCell>
                    <TableCell>
                        {data.username}
                    </TableCell>
                    <TableCell>
                        {data.email}
                    </TableCell>
                    <TableCell>
                        <Button className={classes.button} onClick={()=>this.deleteUser(data._id)}>
                            Delete
                        </Button>
                    </TableCell>
                </TableRow>
            );
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <Container component="main" className={classes.container}>
                <CssBaseline />
                <CardHeader
                    title="Administrator Page"
                />
                
                <Paper elevation={3} className="container">
                    <Table className="table table-striped table-dark">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.dataTable()}
                        </TableBody>
                    </Table>
                </Paper>
                <br />
                <Alert className={classes.alert} severity="info">
                    This page can only be accessed by administrators
                </Alert>
            </Container>
        );
    }
}

export default withStyles((theme)=>styles(theme))(BoardAdmin);
