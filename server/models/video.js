const mongoose = require("mongoose");

// define data schema
const Video = mongoose.model(
    "Video",
    new mongoose.Schema({
        video_name: {type: String, unique: true},
        video_path: String,
        room_id: Number,
        video_showname: String
    })
);

//data collection 
module.exports = Video;
