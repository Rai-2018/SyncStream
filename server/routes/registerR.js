// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const config = require("../config/authKey.js");
// const User = require("../models/user");
// const Role = require("../models/role");

// router.post('/', (req, res, next) => {
//     console.log(req.body);
    
//     User.find({ email: req.body.email }).exec().then( user => {
//         if(user.length >= 1) {
//             return res.status(409).send({ message: "Email has been used" });
//         } else {
//             bcrypt.hash(req.body.password, 10, (err, hash) => {
//                 if(err) {
//                     console.log(err);
//                     return res.status(500).send({ errror: "err" });
//                 } else {
//                     const user = new User({
//                         _id: new mongoose.Types.ObjectId(),
//                         username: req.body.username,
//                         email: req.body.email,
//                         password: req.body.password,
//                         // role: req.body.role,                    
//                     });
//                     user.save().then(result => {
//                         console.log(result);
//                         res.status(201).send({ message: "Registration Success" });
//                     }).catch(err => { 
//                         console.log(err);
//                         res.status(500).send({ error: err });
//                     });
//                 } 
//             });
//         }
//     }).catch(err => {
//         console.log(err);
//         res.status(422).send({ error: err });
//     });
// });

// module.exports = router;