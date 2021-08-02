const controller = require("../actions/upload-actions");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, __dirname + '/uploadVideos');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(/ /g, '_'));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 // video size <= 1G
    }
});

module.exports = function(app) {
    app.post('/api/upload', 
        upload.single('file'),
        controller.upload
    );
}



