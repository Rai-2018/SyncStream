import React from 'react';
import axios from 'axios';
import './upload.css';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Header = (props) => {
    return (
    <header>
        <h1>{props.title}</h1>
        <span className="stats">videos #: {props.totalvideos }</span>
    </header>
    );
};

const Video = (props) => {
    return (
        <div className="video">
        <span className="video-name">
            {props.name}
        </span>
            <div className="counter">
                <button className="counter-action play"> Play </button>
                <button className="counter-action delete" onClick={() => props.removevideo(props.id)}> Delete </button>    
            </div>
        </div> 
    ); 
}

class UploadVideo extends React.Component {
    state = {
        selectedVideo: null,
        loading: 0
    }

    oneFile = event => {
        var files = event.target.files;
        if(files.length != 1){
            toast.error("Please only submit one file");
            event.target.value = null;
            return false;
        }else {
            return true;
        }
    }

    fileSelectedHandler = event => {
        const files = event.target.files;
        if(this.oneFile(event)){
            this.setState({
                selectedVideo: files,
                loading: 0
            });
        }
    }       

    fileUploadHandler = (event) => {
        const data = new FormData();
        data.append('file', this.state.selectedVideo[0]);
        axios.post('http://' + `${process.env.REACT_APP_URL}` + ':4000/api/video', data, {
                onUploadProgress: ProgressEvent => {
                this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total * 100)
                });
            }
        }).then(function (res){
            toast.success('Upload Successful');
        }).catch(function (err) {
            toast.error(`Upload Fail with status: ${err.statusText}`);
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
              <form method="post" name="videoUpload" action="/api/video" id="#" encType="multipart/form-data">
                <div className="form-group files">
                  <input
                    type="file"
                    name="file"
                    className="form-control"
                    accept="video/*"
                    onChange={this.fileSelectedHandler.bind(this)} />
                  <Progress max="100" color="success" value={this.state.loading} className="mt-4 mb-1">
                    {isNaN(Math.round(this.state.loading, 2)) ? 0 : Math.round(this.state.loading, 2)}%
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

    state = {
        videos: [
            {
                name: "Video1",
                id: 1
              },
              {
                name: "Video2",
                id: 2
              },
              {
                name: "Video3",
                id: 3
              }
            ]
    };

    handleRemovevideo = (id) => {
        this.setState(prevState => {
            return{
                videos: prevState.videos.filter( p => p.id !== id)
            };
        });
    }

    render(){
        return (
            <div>
                <div className="list" >
                    <Header 
                    title="video list" 
                    totalvideos={this.state.videos.length} 
                    />
                    {/* videos list*/}
                    {this.state.videos.map( video =>
                    <Video 
                        name={video.name}
                        id={video.id}
                        key={video.id.toString()}
                        removevideo={this.handleRemovevideo}
                    />
                    )}
                    {/* upload video */}
                    {/* <UploadFile /> */}
                </div>  
                <UploadVideo />
            </div>
        );
    }  
}

export default Upload;
