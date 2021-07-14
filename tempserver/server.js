var express = require('express');
var serverIndex = require('serve-index');
const WebSocket = require('ws').Server;
var server = require('http').createServer();


const app = express();

var port = 4000;
const wss = new WebSocket({ server: server });

wss.on('connection', function connection(ws) {
  console.log("new conn")
  ws.send('something');
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

});

app.get("/",(req,res) => res.send("TEST"))
app.use("/video", express.static(__dirname))

server.on('request', app);
server.listen(port, function() {
    console.log("listening");
});
