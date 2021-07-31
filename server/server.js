const mongoose =require('mongoose');
const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./models");
const Msg = require('./models/chat');

var httpserver = require('http');
var socketIO = require('socket.io')
var url = require('url');
var lastplay = 0;
var lastpause = 0;
var lastskip = 0;
var master = {}
var mod = {}
const app = express();
const Role = db.role;
const server = httpserver.createServer(app)

var corsOptions={
  cors: true,
  origins: '*',
 }
 const io = socketIO(server, corsOptions);


app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use("/video", express.static(__dirname));
require("./routes/uploadvideo")(app);


db.mongoose.connect(
    'mongodb://127.0.0.1/SyncStream', 
    {   useCreateIndex: true, 
        useNewUrlParser: true, 
        useUnifiedTopology: true }
    ).then( () => {
        console.log("connected to MongoDB");
        initial();
    }).catch(err => {
        console.log("Connection error", err);
        process.exit();
});

app.get("/", (req, res) => {
    res.json({ message: "Sync Stream Application"});
});

////////////////////////////////////////////////////////////////////

require("./routes/signInR")(app);
require("./routes/roleroutes")(app);

function initial() {
    Role.estimatedDocumentCount((err,count) => {
        if(!err && count === 0) {
            new Role({ name: "user" }).save(err => {
                if(err) {
                    console.log("error", err);
                }
                console.log("added -- USER -- to roles collection");
            });

            new Role({ name: "moderator" }).save(err => {
                if(err) {
                    console.log("error", err);
                }
                console.log("added -- MODERATOR -- to roles collection");
            });

            new Role({ name: "admin" }).save(err => {
                if(err) {
                    console.log("error", err);
                }
                console.log("added -- ADMININSTRATOR -- to roles collection");
            });
        }
    });
}

////////////////////////////////////////////////////////////////////

io.on('connection', function(socket) {
    const requrl = socket.handshake.url
    const room_id = url.parse(requrl, true).query.roomid;
    socket.join(room_id);

    socket.on('newmessage',msg => {
      console.log('Message received: ', msg)
      io.emit('newmessage',msg)
    });

    socket.on('message', function(message) {
        const obj = JSON.parse(message)
        var action = obj.action;
        if(action === "connect"){
            db.Room.find({room_id: room_id}, (err, role) => {
                if(role[0]){
                    if(obj.user_id == role[0].userName && room_id){
                        console.log("Room: " + room_id + " | master: " + obj.user_id);
                        mod[room_id] = obj.user_id;
                        master[obj.user_id] = socket;
                    } 
                } 
            })
        } else if(action === "skip"){
          var date = Date.now();
          if (Math.floor(date/1000) > Math.floor(lastskip/1000) + 0.01){
            lastskip = date
            socket.broadcast.to(room_id).emit('message',obj.time);
          }
        } else if (action === "request"){
          var user_id = mod[room_id];
          console.log(user_id)
          // console.log(master)
          var socketid = master[user_id].id
          socket.broadcast.to(socketid).emit('message',"new");
        } else if (action === "play") {
            var play = Date.now();
            if (Math.floor(play/1000) > Math.floor(lastplay/1000) + 0.01){
                console.log("Sending action: "+ action);
                lastplay = play;
                socket.broadcast.to(room_id).emit('message',obj.action);
            }
        } else if (action === "paused") {
            var pause = Date.now();
            if (Math.floor(pause/1000) > Math.floor(lastpause/1000) + 0.01){
                console.log("Sending action: "+ action);
                lastpause = pause;
                socket.broadcast.to(room_id).emit('message',obj.action);
            }
        } else if (action === 'url') {
            socket.broadcast.to(room_id).emit('message',obj.url);
        }
  });
});


////////////////////////////////////////////////////////////////////


require("./routes/createroom")(app);

////////////////////////////////////////////////////////////////////

server.listen(4000, function() {
    console.log("listening");
});
