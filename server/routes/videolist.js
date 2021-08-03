const db = require("../models");
var Video = db.video;

// get video list by room_id
module.exports = function(app) {
    app.get('/api/list', function(req, res){  
        var room_id = req.query.room_id;
        console.log(room_id);
        Video.find({room_id: Number(room_id)}, (err, videos) => {
            if(err){
                console.log("get video list fails");
                return res.status(500).send(err);
            }
            return res.status(200).send(videos);
        });
    });
}

