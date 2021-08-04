const db = require("../models");
var Video = db.video;

module.exports = function(app) {
    app.get('/api/delete', function(req, res){ 
        var video_name = req.query.video_name;
        var video_showname = video_name.substring(video_name.indexOf('_') + 1);
        // console.log("delete query name: " + video_name);
        // console.log("delete query showname: " + video_showname);
        Video.deleteOne({video_name: video_name}, (err) => {
            if(err){
                console.log("delete video fails");
                return res.status(500).send({message: err});
            }
            return res.status(200).send({message: video_showname});
        });
    });
}