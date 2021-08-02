const db = require("../models");
var Video = db.video;

module.exports = function(app) {
    app.get('/api/list', (req, res, next) => {
        Video.find({room_name: "room_1"}, (err, video) => {
            if(err){
                console.log("get video list fails");
                return res.status(500).send({ message: err });
            }
            return res.status(200).send(video);
        });
    })
}