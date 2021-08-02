const db = require("../models");
var Video = db.video;

module.exports = function(app) {
    app.get('/api/delete', function(req, res){ 
        console.log(req);
        var video_name = req.query.video_name;
        Video.deleteOne({video_name: video_name}, (err) => {
            if(err){
                console.log("delete video fails");
                return res.status(500).send({message: "delete video fails"});
            }
            return res.status(200).send({message: "delete video successfully"});
        });
    });
}