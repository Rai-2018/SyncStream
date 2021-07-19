// import React from 'react';
// import Avatar from '@material-ui/core/Avatar';
// import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';
// import Container from '@material-ui/core/Container';
// import AuthService from '../services/auth-service';
// import { withStyles } from '@material-ui/styles';

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://material-ui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     marginTop: theme.spacing(8),
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   avatar: {
//     margin: theme.spacing(1),
//     backgroundColor: theme.palette.secondary.main,
//   },
//   form: {
//     width: '100%', // Fix IE 11 issue.
//     marginTop: theme.spacing(1),
//   },
//   submit: {
//     margin: theme.spacing(3, 0, 2),
//   },
// }));

// const required = value => {
//     if(!value) {
//         return (
//             <div className = "alert alert-danger" role = "alert">
//                 This field is required!
//             </div>
//         );
//     }
// };

// class SignIn extends React.Component () {

//   constructor(props) {
//       super(props);
//       this.handleLogin = this.handleLogin.bind(this);
//       this.onChangeUsername = this.onChangeUsername.bind(this);
//       this.onChangePassword = this.onChangePassword.bind(this);

//       this.state = {
//           username: "",
//           password: "",
//           loading: false,
//           message: "",
//       };
//   }

//   onChangeUsername(e) {
//       this.setState({
//           username: e.target.value
//       });
//   }

//   onChangePassword(e) {
//       this.setState({
//           password: e.target.value
//       });
//   }

//   handleLogin(e) {
//       e.preventDefault();
//       this.setState({
//           message: "",
//           loading: false
//       });
//       this.form.validateAll();
//       if(this.checkBtn.context._errors.length === 0) {
//           console.log("entered login");
//           AuthService.login(
//               this.state.username,
//               this.state.password
//           )
//           .then(
//               () => {
//                   this.props.history.push("/profile");
//                   window.location.reload();
//               },
//               error => {
//                   const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//                   this.setState({
//                       loading: false,
//                       message: resMessage
//                   });
//               }
//           );
//       } else {
//           this.setState({
//               loading: false
//           });
//       }
//   }


//   render(){
//     const { classes } = this.props;

//     return (
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <div className={classes.paper}>

//           <form className={classes.form} noValidate>
//             <TextField
//               variant="outlined"
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               autoFocus
//             />
//             <TextField
//               variant="outlined"
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//             />
//             <FormControlLabel
//               control={<Checkbox value="remember" color="primary" />}
//               label="Remember me"
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               color="primary"
//               className={classes.submit}
//             >
//               Sign In
//             </Button>
//             <Grid container>
//               <Grid item xs>
//                 <Link href="#" variant="body2">
//                   Forgot password?
//                 </Link>
//               </Grid>
//               <Grid item>
//                 <Link href="#" variant="body2">
//                   {"Don't have an account? Sign Up"}
//                 </Link>
//               </Grid>
//             </Grid>
//           </form>
//         </div>
//         <Box mt={8}>
//           <Copyright />
//         </Box>
//       </Container>
//     );
//   }
// }

// export default withStyles(useStyles)(SignIn)