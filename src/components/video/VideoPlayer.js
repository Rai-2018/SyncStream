import React  from 'react';
import videojs from 'video.js';
import { io } from "socket.io-client";

import 'video.js/dist/video-js.css'
import '@videojs/themes/dist/forest/index.css';

class VideoPlayer extends React.Component {
    constructor(props){
        super(props);
        this.ProcessCommand = this.ProcessCommand.bind(this)
        this.synctime = this.synctime.bind(this)
        this.state = {
          // user_id: (parseInt(Math.random() * 100))% 10, 
          // room_id: (parseInt(Math.random() * 100))% 2,
          user_id: 0,
          room_id: 0,
          start: false
        }
        console.log( "room_id: " + this.state['room_id'])
        console.log( "user_id: " + this.state['user_id'])
    }

    ProcessCommand(data){
      if(data === "play"){
        console.log("Processing: play")
        this.player.play()
      } else if (data === 'paused'){
        console.log("Processing: paused")
        this.player.pause()
      } else if (!isNaN(data) && !isNaN(parseFloat(data))){
        console.log("Processing: skip")
        this.player.currentTime(parseFloat(data)+0.1)
      } else if (data  === "new") {
        console.log("Processing: new requester")
        this.socket.send(JSON.stringify(
          {
            "action": "skip",
            "time": this.player.currentTime()
        }));

        this.socket.send(JSON.stringify(
          {
            "action": "play",
        }));
      }
    }

    componentDidMount() {

        const ws_url = `http://${process.env.REACT_APP_URL}:4000/?roomid=` + this.state['room_id']
        const socket = io.connect(ws_url, {transports: ['websocket'], secure: true, reconnection: false, rejectUnauthorized: false });
        this.socket = socket
        socket.on('connect', () => {
          console.log("Connecting to backend");
            socket.send(JSON.stringify(
                  {
                    'action': "connect",
                    "user_id": this.state['user_id']
                }));

        });

        socket.on("connect_error", (err) => {
          console.log(`connect_error: ${err.message}`);
        });


        socket.on('message', (event) => {

            if(event != null) {
              this.ProcessCommand(event);
            }
        });
        
        this.player = videojs(this.videoNode, this.props, function () {
          this.on('pause', function(event) {
                console.log("paused")
                socket.send(JSON.stringify(
                  {
                    "action":"paused"
                }));
            });
          this.on('play', function(event) {
                console.log("play")
                socket.send(JSON.stringify(
                  {
                    "action":"play"
                }));
            });
          this.on('seeking', function(event) {
                console.log("seeking")
                socket.send(JSON.stringify(
                  {
                    "action": "skip",
                    "time": this.currentTime()
                }));
            });
          this.bigPlayButton.on('click', function(){
                console.log("click")
                socket.send(JSON.stringify(
                  {
                    "action":"play"
                  }));
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
      if (this.state['start'] === false){
          console.log("First Start")
          this.player.controls(true)
          this.setState({"start":true})
      } else {
        this.socket.send(JSON.stringify(
          {
            "action":"request",
          })
        );
      }
    }

    render() {
    return (
      <div> 
        <div data-vjs-player>
          <video className="video-js vjs-theme-forest vjs-16-9" 
                 style={{width: "auto"}} 
                 ref={ node => this.videoNode = node }/>
        </div>
        <button type="button" onClick={this.synctime}>Start</button>
      </div>
    )
    }
}

export default VideoPlayer;

