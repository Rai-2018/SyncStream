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
          roommaster: false,
          started:0
        }
    }

    ProcessCommand(data){
      if(this.state.started == 0){
        return
      }
      if(data === "play"){
        this.player.play()
      } else if (data === 'paused'){
        this.player.pause()
      } else if (!isNaN(data) && !isNaN(parseFloat(data))){
        this.player.currentTime(parseFloat(data)+0.1)
      } else if (data  === "new") {
        this.socket.send(JSON.stringify(
          {
            "action": "url",
            "url": this.videoNode.src
        }));

        this.socket.send(JSON.stringify(
          {
            "action": "skip",
            "time": this.player.currentTime()
        }));

        if(!this.player.paused()){
          this.socket.send(JSON.stringify(
            {
              "action": "play",
          }));
        }
      } else {
        this.videoNode.src = data
      }
    }

    componentDidUpdate(prevProps) {
      var socket = this.socket
      if (this.props.sources[0].src !== prevProps.sources[0].src) {
          this.videoNode.src = this.props.sources[0].src
          this.player.load()
          this.socket.send(JSON.stringify(
            {
              "action": "url",
              "url": this.videoNode.src
            })
          );
      }

    }

    componentDidMount() {

        this.setState({ user_id: this.props.user_id, 
                        userReady: true , 
                        room_id: this.props.room_id, 
                        roomReady: true,
                        props: this.props }, () => {

              const ws_url = `http://${process.env.REACT_APP_URL}:4000/?roomid=` + this.state['room_id']
              const socket = io.connect(ws_url, {transports: ['websocket'], secure: true, reconnection: false, rejectUnauthorized: false });

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


              this.player = videojs(this.videoNode, this.props, function () {
                this.on('pause', function(event) {
                      socket.send(JSON.stringify(
                        {
                          "action":"paused"
                      }));
                  });
                this.on('play', function(event) {
                      socket.send(JSON.stringify(
                        {
                          "action":"play"
                      }));
                  });
                this.on('seeking', function(event) {
                      socket.send(JSON.stringify(
                        {
                          "action": "skip",
                          "time": this.currentTime()
                      }));
                  });
                this.bigPlayButton.on('click', function(){
                      socket.send(JSON.stringify(
                        {
                          "action":"play"
                        }));
                });
              })

              this.socket = socket


              var self = this;
              console.log(this.state.room_id)
              fetch(`http://${process.env.REACT_APP_URL}:4000/check`, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      room_id: this.state.room_id,
                  })
              })
                .then(response => response.json())
                .then(function(data){
                  if(data.message === self.state.user_id){
                    self.setState({roommaster:true})
                  }
                })

        })
    }

    componentWillUnmount() {
        if (this.player) {
          this.player.dispose()
        }
    }

    synctime(){
      if (this.state.roommaster === true){
          this.player.controls(true)
          this.setState({started:1})
      } else {
        this.player.controls(true)
        this.setState({started:1})
        this.socket.send(JSON.stringify(
          {
            "action":"request",
          })
        );
      }
    }

    render() {
      var roommaster = this.state.roommaster
      return (
        <div> 
          <div data-vjs-player>
            <video className="video-js vjs-theme-forest vjs-16-9"
                   style={{width: "auto"}}
                   ref={ node => this.videoNode = node }/>
          </div>
          {roommaster ?   
            <button type="button" onClick={this.synctime}>Start</button>  
            : 
            <button type="button" onClick={this.synctime}>Sync</button> 
          }
          
        </div>
      )
    }
}

export default VideoPlayer;

