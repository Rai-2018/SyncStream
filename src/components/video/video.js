import React from 'react';
import VideoPlayer from './VideoPlayer';

class Player extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
            redirect: null,
            userReady: false,
            currentUser: {username: ""},
            room_id: 0,
            roomReady: false,
      };
    }
    
    render(){
        var videoJsOptions = {
          controls: false,
          loadingSpinner: true,
          bigPlayButton: true,
          sources: [{
            src: `http://${process.env.REACT_APP_URL}:4000/video/a.mp4`,
            type: 'video/mp4',
            fluid: true,
            fill:true,
            responsive:true
          }]
        }

        return (
            <VideoPlayer { ...videoJsOptions }  room_id={this.props.room_id} user_id={this.props.user_id}/>
        )
    }

}

export{Player};
