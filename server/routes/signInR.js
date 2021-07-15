const checkRegistration = require("../middlewares/checkRegistration");
const controller = require("../actions/auth-actions");

module.exports = function(app) {
    
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/auth/register",
        [checkRegistration.checkDuplicates, checkRegistration.checkRoles],
        //function(){ console.log("testing__2"); controller.register; }
        controller.register
    );
    app.post("/api/auth/signin", controller.signin);
};

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const config = require("../config/authKey.js");
// const User = require("../models/user");

// router.post('/', (req, res, next) => {
//     User.find({ email: req.body.email }).exec().then( user => {
//         if(user.length < 1) {
//             return res.status(401).send({ message: "Authentication failed" });
//         }
//         bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//             if(err) {
//                 return res.status(401).send({ message: "Authentication failed" });
//             }

//             if(result) {
//                 const token = jwt.sign({
//                     userId: user[0]._id,
//                     username: user[0].username,
//                     email: user[0].email,
//                     role: user[0].role,
//                 }, config.secret, { expiresIn: "1h" });
//             }
//             res.status(401).send({ message: "Authentication failed" });
//         });
//     }).catch(err => {
//         console.log(err);
//         res.status(500).send({ error: err });
//     });
// });

// module.exports = router;
