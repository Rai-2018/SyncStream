const mongoose =require('mongoose');
// define data schema

const Chat = mongoose.model(
    "Chat",
    new mongoose.Schema({
        comment: String,
        user_name: String,
        timestamp: String,
        received: Boolean,
    })
);


//data collection 
module.exports = Chat