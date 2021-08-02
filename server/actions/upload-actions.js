const db = require("../models");
var Video = db.video;

exports.upload = (req, res) => {
    var video_name = req.file.filename.replace(/ /g, '_');
    var video_path = `http://localhost:4000` + '/video/' + video_name;
    var room_id = Number(req.body.room_id);
    // console.log(room_id);
    // console.log(typeof(room_id));
    const video = new Video({
        video_name: video_name,
        video_path: video_path,
        room_id: room_id
    });
    // console.log(`my video name is ` + video_name);
    // console.log(`my video path is ` + video_path);

    video.save((err, video) => {
        if(err){
            console.log("save fails");
            // console.log(res);
            return res.status(500).send({ message: "video name exists" });
        } 
        return res.status(200).send({ message: video.video_name });
    });
};


