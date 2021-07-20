const express = require('express');
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
        fileSize: 1024 * 1024 * 1024 // 1G
    }
});

module.exports = function(app) {
    app.post('/api/video', upload.single('file'), (req, res, next) => {
        console.log("success");
        res.status(200).json({
            message: 'Upload Success'
        });
    });
}