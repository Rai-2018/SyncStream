import React from 'react';
import axios from 'axios';
import './upload.css';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MovieIcon from '@material-ui/icons/Movie';
import { List, ListItem, ListItemText, Box, Button, LinearProgress, Divider } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';


class Video extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user_id: '',
            is_roommaster: false,
            room_id: 0,
            video_list: []
        }
    };

    componentDidMount() {
        this.props.listRetrieveHandler();
        
        this.setState({ user_id: this.props.user_id,
                        room_id: this.props.room_id,
                        video_list: this.props.video_list}, () => {
                // console.log(this.props.room_id);
                var self = this;
                fetch(`http://${process.env.REACT_APP_URL}:4000/check`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        room_id: this.state.room_id,
                    })
                })
                    .then(response => response.json())
                    .then(function(data){
                    if(data.message === self.state.user_id){
                        self.setState({is_roommaster: true})
                        // console.log(self.state.is_roommaster)
                    }
                })
        })   
    }

    componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      if (this.props.video_list !== prevProps.video_list) {
            this.setState({video_list:this.props.video_list})
      }
    }

    
    removeVideoHandler = (videoName) => {
        var self=this;
        axios.get(`http://${process.env.REACT_APP_URL}:4000/api/delete`, {
            params: {
                video_name: videoName
            }
        }).then(res => {
            if(res.data.message == "delete video fails"){
                toast.error(`Delete Fail with status: ${res.data.message}`);
            }
            else {
                console.log(res.data);
                toast.success(`Delete Successful for video: ${res.data.message}`);
            }
            // TODO
            self.props.listRetrieveHandler();
        }).catch( err => {
            toast.error(`Get Video List Fail with status: ${err}`);
        });
    }

    render(){
        // var video_path = `http://${process.env.REACT_APP_URL}:4000/video/a.mp4`;
        // console.log(this.state.video_list)
        const videos = this.state.video_list.map(video => {
            var is_roommaster = this.state.is_roommaster
            return(
                <div>
                <ListItem borderColor="grey.500" style={{border:1}}>       
                    <MovieIcon style={{color: "FFB266"}} />
                    <ListItemText primary= {video.video_showname} />
                        {is_roommaster ? 
                            <div spacing={2}>
                                <Button variant="contained" color="primary" 
                                onClick={() => 
                                this.props.updateShared(`http://${process.env.REACT_APP_URL}:4000/video/` + video.video_name)}
                                >PLAY</Button>
                                <Button variant="contained" style={{ marginLeft: '0.8rem' }} onClick={() => 
                                this.removeVideoHandler(video.video_name)}
                                >DELETE</Button>
                            </div>
                            : <div></div>
                        }             
                </ListItem>
                <Divider />  
                </div>
            );     
        });
       
        return (
          <React.Fragment>
            <div className="list" >
                <header>
                    <h1>video list</h1>
                    <span className="stats">videos #: {this.props.video_list.length}</span>
                </header>
                <List component="ul" style={{height: 280, overflowY: 'auto'}} >
                    { videos }
                </List>
            </div>
          </React.Fragment>
        ); 
    }
}

class UploadVideo extends React.Component {
    constructor(props){
        super(props);
        this.listRetrieveHandler = this.listRetrieveHandler.bind(this);
        this.state = {
            selectedVideo: null,
            loaded: 0
        }
    };
   
    listRetrieveHandler() {
        this.props.listRetrieveHandler();
    }

    fileSelectedHandler = (files) => {
        this.setState({
            selectedVideo: files,
            loaded: 0
        });
    }       

    fileUploadHandler = (event) => {
        const data = new FormData();      
        // console.log(this.props.room_id);
        var videoFile = this.state.selectedVideo[0];
        // console.log(videoFile);
        if(videoFile == null){
            toast.error("Please choose the video!");
            return;
        } else {
            var newFileName = this.props.room_id + '_' + videoFile.name;
            // console.log(videoFiles[0].name);
            data.append('file', videoFile, newFileName);
        }  
        data.append('room_id', this.props.room_id);
        var self = this;
        // console.log(`front side http://${process.env.REACT_APP_URL}:4000/api/upload`);
        axios.post(`http://${process.env.REACT_APP_URL}:4000/api/upload`, data, {
                onUploadProgress: ProgressEvent => {
                this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total * 100)
                });
            }
        }).then(function (res){
            // console.log(res);
            if(res.data.message == "video name exists"){
                toast.error(`Upload Fail with status: ${res.data.message}`);
            }
            else {
                toast.success(`Upload Successful for video: ${res.data.message}`);
            }

            // TODO refresh video list
            self.listRetrieveHandler();

        }).catch(function (err) {
            toast.error(`Upload Fail with status: ${err}`);
        });
    }

    render() {
        return (
          <React.Fragment>
            <div className="container mt-5">
              <div className="form-group">
                <ToastContainer />
              </div>
              <h4 style={{color: "#5F5F5F"}}>Upload Your MP4 Video</h4>
              <DropzoneArea
                acceptedFiles={['video/mp4']}
                onChange={this.fileSelectedHandler.bind(this)}
                showFileNames
                dropzoneText="Drop Video Here or Browse"
                showAlerts={false}
                maxFileSize={1073741824}
                filesLimit={1}
               />
               <LinearProgress variant="determinate" value={this.state.loaded} />
               <Progress max="100" color="success" value={this.state.loaded} className="mt-4 mb-1">
                    {isNaN(Math.round(this.state.loaded, 2)) ? 0 : Math.round(this.state.loaded, 2)}%
               </Progress>
               <button 
                    type="button"
                    className="btn btn-success btn-block"
                    onClick={this.fileUploadHandler.bind(this)}>Upload Video
                </button> 

              {/* <hr className="my-4" />  
              <form method="post" name="videoUpload" action="/api/upload" id="#" encType="multipart/form-data">
                <div className="form-group files">
                  <input
                    type="file"
                    name="file"
                    className="form-control"
                    accept="video/mp4"
                    onChange={this.fileSelectedHandler.bind(this)} />
                  <Progress max="100" color="success" value={this.state.loaded} className="mt-4 mb-1">
                    {isNaN(Math.round(this.state.loaded, 2)) ? 0 : Math.round(this.state.loaded, 2)}%
                  </Progress>
                    <button
                        type="button"
                        className="btn btn-success btn-block"
                        onClick={this.fileUploadHandler.bind(this)}>Upload Video
                    </button>         
                </div>
              </form>  */}
            </div>
          </React.Fragment>
        );
    }
}

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.updateShared = this.updateShared.bind(this)
        this.state = {
            video_list: []
        }
    }

    updateShared(url) {
        this.props.updateShared(url);
    }

    listRetrieveHandler = (event) => {
        axios.get(`http://${process.env.REACT_APP_URL}:4000/api/list`, {
            params: {
                room_id: this.props.room_id
            }
        }).then(res => {
            // console.log(res);
            // console.log(res.data);
            this.setState({
                video_list: res.data
            });
        }).catch( err => {
            toast.error(`Get Video List Fail with status: ${err}`);
        });
    }    

    render(){
        return (
            <div >
                <Box display="flex" flexDirection="row" p={1} m={1} bgcolor="background.paper">
                    <Box  width='80%' bgcolor="white">
                        {/* videos list*/}
                        <Video 
                            updateShared={this.updateShared}
                            room_id={this.props.room_id}
                            user_id={this.props.user_id} 
                            video_list={this.state.video_list}
                            listRetrieveHandler={this.listRetrieveHandler}
                        />
                    </Box>
                    <Box  width='40%' bgcolor="white">
                        {/* upload video*/}
                        <UploadVideo 
                            room_id={this.props.room_id}
                            video_list={this.state.video_list}
                            listRetrieveHandler={this.listRetrieveHandler}
                        />
                    </Box>  
                </Box>
            </div>
        );
    }  
}

export default Upload;


                        
                       