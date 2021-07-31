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
          user_id: '',
          userReady: false,
          room_id: 0,
          roomReady: false,
          start: false,
          src: "",
          prop: null
        }
    }

    ProcessCommand(data){
      if(data === "play"){
        this.player.play()
      } else if (data === 'paused'){
        this.player.pause()
      } else if (!isNaN(data) && !isNaN(parseFloat(data))){
        this.player.currentTime(parseFloat(data)+0.1)
      } else if (data  === "new") {
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

    componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      if (this.props.sources[0].src !== prevProps.sources[0].src || prevProps == null) {
        console.log("update")

        this.setState({props:this.props}, () => {
          var self = this
          this.player = videojs(this.videoNode, this.props, function () {
            this.on('pause', function(event) {
                  self.state.socket.send(JSON.stringify(
                    {
                      "action":"paused"
                  }));
              });
            this.on('play', function(event) {
                  self.state.socket.send(JSON.stringify(
                    {
                      "action":"play"
                  }));
              });
            this.on('seeked', function(event) {
                  console.log('skipping')
                  self.state.socket.send(JSON.stringify(
                    {
                      "action": "skip"
                  }));
              });
            this.bigPlayButton.on('click', function(){
                  self.state.socket.send(JSON.stringify(
                    {
                      "action":"play"
                    }));
            });
          });
        })
      }
    }

    componentDidMount() {
        this.setState({ user_id: this.props.user_id, userReady: true }, () => {
          this.setState({ room_id: this.props.room_id, roomReady: true }, () => {
            console.log("user_id: " + this.state.user_id)
            console.log("room_id: " + this.state.room_id)
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

            })

            socket.on("connect_error", (err) => {
              console.log(`connect_error: ${err.message}`);
            });

            socket.on('message', (event) => {

                if(event != null) {
                  this.ProcessCommand(event);
                }
            });
            
            this.setState({ socket: socket})

          });
        })
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

