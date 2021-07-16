import React from 'react';
import axios from 'axios';
import './upload.css';
//import { Progress } from 'reactstrap';
//import { ToastContainer, toast } from 'react-toastify';

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

// class UploadVideo extends React.Component {
//     state = 

//     fileSelectedHandler = event => {
//         console.log(event.target.files[0]);
//     }

//     fileUploadHandler = () => {

//     }


// }

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
            <div className="list">
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
        );
    }  
}

export default Upload;
