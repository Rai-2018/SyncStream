import React from 'react';
import axios from 'axios';
import videojs from 'video.js';

import 'video.js/dist/video-js.css'
import '@videojs/themes/dist/forest/index.css';
import { Redirect } from 'react-router-dom';

class VideoPlayer extends React.Component {
    constructor(props){
        super(props);
        this.ProcessCommand = this.ProcessCommand.bind(this)
        this.state = {
          user_id: (parseInt(Math.random() * 100))% 2
        }
        console.log(this.state['user_id'])
    }


    ProcessCommand(data){
      console.log(data)
      if(data === "play"){
        console.log("Processing: play")
        this.player.play()
      } else if (data === 'paused'){
        console.log("Processing: paused")
        this.player.pause()
      } else if (!isNaN(data) && !isNaN(parseFloat(data))){
        console.log("Processing: skip")
        this.player.currentTime(parseFloat(data))
      }
      
    }

    componentDidMount() {

        const ws_url = 'ws://localhost:4000/?id=' + this.state['user_id']
        const socket = new WebSocket(ws_url);

        socket.addEventListener('open', function (event) {
            console.log('Open connection to WebSocket')
        });

        socket.addEventListener('message', (event) => {
            if(event.data != null) {
              this.ProcessCommand(event.data);
            }
        }) ;
        
        this.player = videojs(this.videoNode, this.props, function () {
          this.on('pause', function(event) {
                socket.send(JSON.stringify({"id":0,"status":"paused"}));
            });
          this.on('play', function(event) {
                socket.send(JSON.stringify({"id":0,"status":"play"}));
            });
          this.on('seeked', function(event) {
                socket.send(JSON.stringify({"id":0,"status":this.currentTime()}));
            });
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
          <video 
              class="video-js vjs-theme-forest" 
              ref={ node => this.videoNode = node }
          />

        </div>
      </div>
    )
    }
}

export default VideoPlayer;

