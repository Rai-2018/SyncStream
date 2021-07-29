import React from 'react';
import VideoPlayer from './VideoPlayer';

class Player extends React.Component {
    render(){
        var videoJsOptions = {
          controls: false,
          loadingSpinner: true,
          bigPlayButton: true,
          sources: [{
            src: 'http://34.152.45.178:4000/video/a.mp4',
            type: 'video/mp4',
            fluid: true,
            fill:true,
            responsive:true
          }]
        }
        return (
            <VideoPlayer { ...videoJsOptions }  />
        )
    }

}

export{Player};
