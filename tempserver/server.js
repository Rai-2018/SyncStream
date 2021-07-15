var express = require('express');
var serverIndex = require('serve-index');
var httpserver = require('http');
var url = require('url');
var socketIO = require('socket.io')

const app = express();
const server = httpserver.createServer(app)
const io = socketIO(server);


app.use("/video", express.static(__dirname))

var lasttime = 0;
var master = {}

io.on('connection', function(socket) {
  const requrl = socket.handshake.url
  const room_id = url.parse(requrl, true).query.roomid;
  socket.join(room_id);
  console.log("Opening new connection: room_id: " + room_id);

  socket.on('message', function(message) {
    const obj = JSON.parse(message)
    var action = obj.action
    console.log("Sending action: " + action);

    if(action === "connect"){
      if(master[room_id] == null){
        console.log("Room: " + room_id + " | master: " + obj.user_id);
        master[room_id] = socket;
      } 

    } else if(action === "skip"){
      var date = Date.now();
      if (Math.floor(date/1000) > Math.floor(lasttime/1000) + 0.03){
        lasttime = date
        socket.broadcast.to(room_id).emit('message',obj.time);
      }

    } else if (action === "request"){
      var socketid = master[room_id].id
      socket.broadcast.to(socketid).emit('message',"new");

    } else {
      socket.broadcast.to(room_id).emit('message',obj.action);
    }
  });
});

server.listen(4000, function() {
    console.log("listening");
});














