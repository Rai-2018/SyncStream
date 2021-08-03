const db = require("../models");
var Video = db.video;

exports.upload = (req, res) => {
    var room_id = Number(req.body.room_id);
    var video_name = req.file.filename;
    // console.log(video_name);
    var video_showname = video_name.substring(video_name.indexOf('_') + 1);
    var video_path = `http://localhost:4000` + '/video/' + video_name;
    // console.log(room_id);
    // console.log(typeof(room_id));
    const video = new Video({
        video_name: video_name,
        video_path: video_path,
        room_id: room_id,
        video_showname: video_showname
    });
    // console.log(`my video name is ` + video_name);
    // console.log(`my video path is ` + video_path);

    video.save((err, video) => {
        if(err){
            console.log("save fails");
            // console.log(res);
            return res.status(500).send({ message: "video name exists" });
        } 
        return res.status(200).send({ message: video.video_showname });
    });
};


