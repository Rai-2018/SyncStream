const jwt = require("jsonwebtoken");
const config = require("../config/authKey.js");
const User = require("../models/user");
const Role = require("../models/role");

checkToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    try {
        var decoded = jwt.verify(token, config.secret);
        req.userData = decoded;
        next();
    } catch(err) {
        return res.status(401).send({ message: "Unauthorized." });
    }
};

checkAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find(
            { _id: { $in: user.roles }},
            (err, roles) => {
                if(err) {
                    res.status(500).send({ message: err });
                    return;
                }
                for(let i = 0; i < roles.length; i++) {
                    if(roles[i].name === "admin") {
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: "Not Admin" });
                return;
            }
        );
    });
};

checkMod = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find(
            { _id: { $in: user.roles }},
            (err, roles) => {
                if(err) {
                    res.status(500).send({ message: err });
                    return;
                }
                for(let i = 0; i < roles.length; i++) {
                    if(roles[i].name === "moderator") {
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: "Not Moderator" });
                return;
            }
        );
    });
};

const checkAuth = {
    checkToken,
    checkAdmin,
    checkMod
};


module.exports = checkAuth;
