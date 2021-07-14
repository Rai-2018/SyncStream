import React from 'react';
import axios from 'axios';
import videojs from 'video.js';

import 'video.js/dist/video-js.css'
import '@videojs/themes/dist/forest/index.css';
import { Redirect } from 'react-router-dom';

class VideoPlayer extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
          console.log('onPlayerReady', this)
        });
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
          this.player.dispose()
        }
    }

    render() {
    return (
      <div> 
        <div data-vjs-player>
          <video class="video-js vjs-theme-forest" ref={ node => this.videoNode = node } ></video>
        </div>
      </div>
    )
    }
}

export default VideoPlayer;
