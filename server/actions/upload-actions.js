const db = require("../models");
var Video = db.video;

exports.upload = (req, res) => {
    var video_name_ = req.file.filename.replace(/ /g, '_');
    var video_name = video_name_.replace(/.mov|.mpg|.mpeg|.mp4|.wmv|.avi/gi, '');
    var video_path = `http://localhost:4000` + '/video/' + video_name_;
    const video = new Video({
        video_name: video_name,
        video_path: video_path,
        room_name: "room1"
    });
    // console.log(`my video name is ` + video_name);
    // console.log(`my video path is ` + video_path);

    video.save((err, video) => {
        if(err){
            console.log("save fails");
            return res.status(500).send({ message: "video name exists" });
        } 
        return res.status(200).send({ message: video.video_name });
    });
};


