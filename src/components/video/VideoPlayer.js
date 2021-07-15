import React , { useEffect, useState } from 'react';
import axios from 'axios';
import videojs from 'video.js';
import { io } from "socket.io-client";

import 'video.js/dist/video-js.css'
import '@videojs/themes/dist/forest/index.css';
import { Redirect } from 'react-router-dom';


class VideoPlayer extends React.Component {
    constructor(props){
        super(props);
        this.ProcessCommand = this.ProcessCommand.bind(this)
        this.synctime = this.synctime.bind(this)
        this.state = {
          user_id: (parseInt(Math.random() * 100))% 10, 
          room_id: 0
        }
        console.log( "room_id: " + this.state['room_id'])
        console.log( "user_id: " + this.state['user_id'])
    }


    ProcessCommand(data){
      console.log(data)
      if(data === "play"){
        console.log("Processing: play")
        this.player.play()
      } else if (data === 'paused'){
        console.log("Processing: paused")
        this.player.pause()
      } else if (data === "playbutton"){
        console.log("Processing: play button")
        this.player.load()
      } else if (!isNaN(data) && !isNaN(parseFloat(data))){
        console.log("Processing: skip")
        this.player.currentTime(parseFloat(data)+0.1)
      } else if (data  === "new") {
        console.log("Processing: new requester")
        this.socket.send(JSON.stringify({"status":this.player.currentTime()}));
      }
      
    }

    componentDidMount() {

        const ws_url = 'http://localhost:4000/?roomid=' + this.state['room_id'] + "&userid=" + this.state['user_id']
     
        const socket = io.connect(ws_url, {transports: ['websocket'], secure: true, reconnection: false, rejectUnauthorized: false });
        this.socket = socket
        socket.on('connect', () => {
          console.log("Connecting to backend");
        });

        socket.on("connect_error", (err) => {
          console.log(`connect_error: ${err.message}`);
        });


        socket.on('message', (event) => {
            console.log(event)
            if(event != null) {
              this.ProcessCommand(event);
            }
        });
        
        this.player = videojs(this.videoNode, this.props, function () {
          this.on('pause', function(event) {
                socket.send(JSON.stringify({"status":"paused"}));
            });
          this.on('play', function(event) {
                socket.send(JSON.stringify({"status":"play"}));
            });
          this.on('seeked', function(event) {
                socket.send(JSON.stringify({"status":this.currentTime()}));
            });
          this.bigPlayButton.on('click', function(){
                socket.send(JSON.stringify({"status":"playbutton"}));
          });

        });

    }

    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
          this.player.dispose()
        }
    }

    synctime(){
      console.log("trying to sync")
      this.socket.send(JSON.stringify({"status":"request"}));
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
        <button type="button" onClick={this.synctime}>Click Me!</button>

      </div>
    )
    }
}

export default VideoPlayer;

