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
  const user_id = url.parse(requrl, true).query.userid;
  socket.join(room_id);
  console.log("room_id: " + room_id + " | user_id: " + user_id);

  if(master[room_id] == null){
    console.log("It is empty");
    master[room_id] = user_id;
  } else {
    console.log("Not empty")
    socket.broadcast.to(room_id).emit('message',"new");
  }

  socket.on('message', function(message) {
    const obj = JSON.parse(message)
    console.log("status: " + obj.status)
    var data = obj.status
    if(!isNaN(data) && !isNaN(parseFloat(data))){
      var date = Date.now();
      if (Math.floor(date/1000) > Math.floor(lasttime/1000) + 0.05){
        lasttime = date
        socket.broadcast.to(room_id).emit('message',obj.status);
      }
    } else if (data === "request"){
      socket.broadcast.to(room_id).emit('message',"new");
    } else {
      socket.broadcast.to(room_id).emit('message',obj.status);
    }
  });
});

server.listen(4000, function() {
    console.log("listening");
});














