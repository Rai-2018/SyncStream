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
            src_url:''
      };
    }

    componentDidUpdate(prevProps) {

      // Typical usage (don't forget to compare props):

      if (this.props.shared_var !== prevProps.shared_var) {
        this.setState({src_url:this.props.shared_var})
      }
    }


    render(){
        var src_url = this.props.shared_var;
        var changed = this.props.changed;
        var videoJsOptions = {
          controls: false,
          loadingSpinner: true,
          bigPlayButton: true,
          preload:"none",
          sources: [{
            src: src_url,
            type: 'video/mp4',
            fluid: true,
            fill:true,
            responsive:true
          }]
        }
        return (
            <div>
                <VideoPlayer { ...videoJsOptions }  room_id={this.props.room_id} user_id={this.props.user_id} changed={changed}/>
            </div>
        )
    }

}

export{Player};
