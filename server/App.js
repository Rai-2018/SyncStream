// import * as mongoose from 'mongoose';

// const express = require("express");
// const app = express();
// const morgan = require("morgan");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const mongoose = require("mongoose");

// // mongoose.connect(
// //     'mongodb://127.0.0.1/SyncStream', 
// //     { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
// // ).then( () => {
// //     console.log("connected to MongoDB");
// // }).catch(err => {
// //     console.log("Connection error", err);
// //     process.exit();
// // });

// // var mongoose = require('mongoose');

// var mongoURI = "mongodb://localhost:27017/SyncStream";
// var MongoDB = mongoose.connect(mongoURI).connection;
// MongoDB.on('error', function(err) { console.log(err.message); });
// MongoDB.once('open', function() {
//   console.log("mongodb connection open");
// });

// mongoose.Promise=global.Promise;

// app.use(morgan('dev'));
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use('/api/signin', require("./routes/signInR"));
// app.use('/api/register', require('./routes/registerR'));

// module.exports = app;
