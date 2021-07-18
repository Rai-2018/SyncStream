const mongoose =require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./models");
const Pusher = require("pusher")


var httpserver = require('http');
var socketIO = require('socket.io')
var url = require('url');
var lasttime = 0;
var master = {}


const app = express();
const Role = db.role;
const server = httpserver.createServer(app)
const io = socketIO(server);
var corsOptions = { origin: "*" };

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/video", express.static(__dirname))
app.use(express.json());

const pusher = new Pusher({
    appId: "1234099",
    key: "5391b962e408f216b9b0",
    secret: "a8ea476c010edc52fb6d",
    cluster: "us3",
    useTLS: true
  });



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
      if (Math.floor(date/1000) > Math.floor(lasttime/1000) + 0.01){
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

////////////////////////////////////////////////////////////////////

// const database = mongoose.connection
// database.once('open', ()=>{
//     console.log("database is connected")

//     const chatCollection = database.collection("SyncStream");
//     const changeStream = chatCollection.watch();

    // changeStream.on('change', (change)=>{
    //     console.log(change);

        // // put all data in fullDocuments in comment
        // if(change.operationType === 'insert'){
        //     const commentDetails = change.fullDocument;
        //     pusher.trigger('chats', 'inserted', {
        //         user_name: commentDetails.user_name,
        //         comment: commentDetails.comment,
        //         timestamp: commentDetails.timestamp,
        //         received: commentDetails.received,
        //     });
        // }else{
        //     console.log('Error triggering Pusher');
        // }

    // });
// })

// const Comments = db.comments

// const ncomm = new Comments({
//     comment: "DF",
//     user_name: "DSFSDF",
//     timestamp: "SDFSDFSDF",
//     received: true
// })

// ncomm.save()

// app.get('/comments/sync', (req, res) => {
//     Comments.find((err ,data)=>{
//         if(err){
//             res.status(500).send(err)
//         }else{
//             res.status(200).send(data)
//         }
//     })
// })

// app.post('/comments/new', (req, res) => {
//     const dbComment = req.body

//     Comments.create(dbComment, (err ,data)=>{
//         if(err){
//             res.status(500).send(err)
//         }else{
//             res.status(201).send(data)
//         }
//     })
// })
////////////////////////////////////////////////////////////////////

server.listen(4000, function() {
    console.log("listening");
});
