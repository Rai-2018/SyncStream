import React from 'react';
import VideoPlayer from './VideoPlayer';

class Player extends React.Component {
    render(){
        var videoJsOptions = {
          // autoplay: false,
          controls: true,
          loadingSpinner: true,
          bigPlayButton: true,
          sources: [{
            src: 'http://localhost:4000/video/a.mp4',
            type: 'video/mp4',
            fluid: true,
            fill: true
          }]
        }
        return (
            <VideoPlayer { ...videoJsOptions } />
        )
    }

}

export{Player};
