import React from 'react';
import VideoPlayer from './VideoPlayer';

class Player extends React.Component {
    render(){
        var videoJsOptions = {
          controls: false,
          loadingSpinner: true,
          bigPlayButton: true,
          sources: [{
            src: 'http://localhost:4000/video/a.mp4',
            type: 'video/mp4',
            fluid: true,
          }]
        }
        return (
            <div>
            <VideoPlayer { ...videoJsOptions } />
            </div>
        )
    }

}

export{Player};
