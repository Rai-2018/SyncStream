import React from 'react';
import {Player as VideoPlayer} from '../video/video';
import Upload from '../upload/upload';
import Chatbox from '../chatbox/Chat';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  }));


export default function Main() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
        <Grid container spacing={3}>
            <Grid item xs={8}>
            <Paper className={classes.paper}>
                <VideoPlayer/>
                <Upload />
            </Paper>
            </Grid>
            <Grid item xs={4}>
            <Paper className={classes.paper}>
                <Chatbox />
            </Paper>
            </Grid>
        </Grid>
        </div>      
    );
}