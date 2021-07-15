var express = require('express');
var serverIndex = require('serve-index');
var httpserver = require('http');
var url = require('url');
var socketIO = require('socket.io')

const app = express();
const server = httpserver.createServer(app)
const io = socketIO(server);

// const WebSocket = require('ws').Server;
// const wss = new WebSocket({ server: server });


app.use("/video", express.static(__dirname))

var lasttime = 0;

io.on('connection', function(socket) {
  const requrl = socket.handshake.url
  const room_id = url.parse(requrl, true).query.id;

  socket.join(room_id);
  console.log("user_id: " + room_id);

  socket.on('message', function(message) {
    const obj = JSON.parse(message)
    console.log("status: " + obj.status)
    var data = obj.status
    if(!isNaN(data) && !isNaN(parseFloat(data))){
      var date = Date.now();
      console.log(date)
      if (Math.floor(date/1000) > Math.floor(lasttime/1000) + 0.5){
        lasttime = date
        socket.broadcast.to(room_id).emit('message',obj.status);
      }
    } else {
        socket.broadcast.to(room_id).emit('message',obj.status);
    }
  });
});

server.listen(4000, function() {
    console.log("listening");
});














