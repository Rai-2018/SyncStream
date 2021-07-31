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
          changed: 0
        }
    }

    ProcessCommand(data){
      if(this.state.changed == 0){
        return
      }
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
          console.log(this.player)
          console.log(this.videoNode)
          // if(this.player){
          //   this.player.dispose()
          // }
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

          this.videoNode.src = this.props.sources[0].src
          this.player.load()
      }

      if (this.props.changed !== prevProps.changed) {
        this.setState({changed:this.props.changed})
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


              // this.player = videojs(this.videoNode, this.props, function () {
              //   this.on('pause', function(event) {
              //         socket.send(JSON.stringify(
              //           {
              //             "action":"paused"
              //         }));
              //     });
              //   this.on('play', function(event) {
              //         socket.send(JSON.stringify(
              //           {
              //             "action":"play"
              //         }));
              //     });
              //   this.on('seeking', function(event) {
              //         socket.send(JSON.stringify(
              //           {
              //             "action": "skip",
              //             "time": this.currentTime()
              //         }));
              //     });
              //   this.bigPlayButton.on('click', function(){
              //         socket.send(JSON.stringify(
              //           {
              //             "action":"play"
              //           }));
              //   });
              // })

              this.socket = socket
        })
    }

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
      var changed = this.state.changed
      var started = this.state.start
      return (
        <div> 
          <div data-vjs-player>
            <video className="video-js vjs-theme-forest vjs-16-9"
                   style={{width: "auto"}}
                   ref={ node => this.videoNode = node }/>
          </div>
          {changed && !started ?   <button type="button" onClick={this.synctime}>Start</button>  : null }
          {changed && started ?   <button type="button" onClick={this.synctime}>Sync</button>  : null }

        </div>
      )
    }
}

export default VideoPlayer;

