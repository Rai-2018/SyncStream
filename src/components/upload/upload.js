import React from 'react';
import axios from 'axios';
import './upload.css';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import {Link, Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { VideoCallSharp } from '@material-ui/icons';

class Video extends React.Component {
    constructor(props){
        super(props);
    
        let shouldRedirect = false;

        this.state = {
            redirect: shouldRedirect,
            videoList: []
        }
    };

    componentDidMount() {
        axios.get(`http://${process.env.REACT_APP_URL}:4000/api/list`, {
            headers: {
                // 'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userTokenTime')).token
            }
        }).then(res => {
            this.setState({
                videoList: res.data
            });
        }).catch( err => {
            toast.error(`Get Video List Fail with status: ${err}`);
        });
    }

    render(){
        var video_path = `http://${process.env.REACT_APP_URL}:4000/video/a.mp4`;
        if (this.state.redirect) return <Redirect to="/main" />

        const videos = this.state.videoList.map(video => {
            <div className="video">
            <span className="video-name">
                {this.props.name}
            </span>
                <div className="counter">
                    <button className="counter-action play" onClick={() => this.props.updateShared(video_path)}> Play </button>
                    <button className="counter-action delete" onClick={() => this.props.removevideo(this.props.id)}> Delete </button>    
                </div>
            </div> 
        });

        return (
          <React.Fragment>
            <button onClick={() => this.setState({redirect: true})}> Refresh </button>
            <div className="list" >
                <header>
                    <h1>video list</h1>
                    <span className="stats">videos #: {this.state.videoList.length}</span>
                </header>
                <div>
                    { videos }
                </div>
            </div>
          </React.Fragment>
        ); 
    }
}

class UploadVideo extends React.Component {
    constructor(props){
        super(props);
    };
    state = {
        selectedVideo: null,
        loaded: 0
    }

    fileSelectedHandler = event => {
        const files = event.target.files;
        this.setState({
            selectedVideo: files,
            loaded: 0
        });
    }       

    fileUploadHandler = (event) => {
        const data = new FormData();
        data.append('file', this.state.selectedVideo[0]);
        axios.post(`http://${process.env.REACT_APP_URL}:4000/api/upload`, data, {
                onUploadProgress: ProgressEvent => {
                this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total * 100)
                });
            }
        }).then(function (res){
            toast.success('Upload Successful');

            // TODO: refresh video list

        }).catch(function (err) {
            toast.error(`Upload Fail with status: video name exists`);
        });
    }

    render() {
        return (
          <React.Fragment>
            <div className="container mt-5">
              <div className="form-group">
                <ToastContainer />
              </div>
              <h4>Upload Your Video</h4>
              <hr className="my-4" />  
              <form method="post" name="videoUpload" action="/api/upload" id="#" encType="multipart/form-data">
                <div className="form-group files">
                  <input
                    type="file"
                    name="file"
                    className="form-control"
                    accept="video/*"
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
              </form>
            </div>
          </React.Fragment>
        );
    }
}

class Upload extends React.Component {

    constructor(props) {
        super(props);
        this.updateShared = this.updateShared.bind(this)
        // this.state = {
        //     videos: [
        //         {
        //             name: "Video1",
        //             id: 1
        //           },
        //           {
        //             name: "Video2",
        //             id: 2
        //           },
        //           {
        //             name: "Video3",
        //             id: 3
        //           }
        //         ]
        // };
    }

    // handleRemovevideo = (id) => {
    //     this.setState(prevState => {
    //         return{
    //             videos: prevState.videos.filter( p => p.id !== id)
    //         };
    //     });
    // }

    updateShared(url) {
        this.props.updateShared(url);
    }

    handleGetlist = () => {
        this.setState(prevState => {
            
        })
    }

    render(){
        return (
            <div>
                {/* videos list*/}
                <Video 
                    removevideo={this.handleRemovevideo}
                    updateShared={this.updateShared}
                />
                {/* upload video*/}
                <button onClick={() => this.updateShared(`http://${process.env.REACT_APP_URL}:4000/video/a.mp4`)}> TEST </button>
                <button onClick={() => this.updateShared(`http://${process.env.REACT_APP_URL}:4000/video/b.mp4`)}> TEST1 </button>
                <UploadVideo />
            </div>
        );
    }  
}

export default Upload;
