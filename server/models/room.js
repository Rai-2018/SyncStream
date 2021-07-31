const mongoose =require('mongoose');

// define data schema
const Room = mongoose.model(
    "Room",
    new mongoose.Schema({
        room_name: {type:String,unique: true},
        room_id: Number,
        userName: String
    })
);

//data collection 
module.exports = Room