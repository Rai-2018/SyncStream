const db = require("../models");
var Video = db.video;

module.exports = function(app) {
    app.get('/api/list', (req, res, next) => {
        Video
        .find()
        .exec()
        .then(docs => {
          res.status(200).json(docs);
        })
        .catch(err => {
            console.log("get video list fails");
          res.status(500).send({ message: err });
        });
    });
}