const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicates = (req, res, next) => {
    User.findOne({  // check username
        username: req.body.username 
    }).exec((err, user) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        if(user) {
            console.log("username in use");
            res.status(400).send({ message: "Username in use already." });
            
            return;
        }

        User.findOne({  // check email
            username: req.body.email 
        }).exec((err, user) => {
            if(err) {
                res.status(500).send({ message: err });
                return;
            }
    
            if(user) {
                res.status(400).send({ message: " already." });
                return;
            }

            next();
        });
    });
};

checkRoles = (req, res, next) => {
    if(req.body.roles) {
        for(let i = 0; i < req.body.roles.length; i++) {
            if(!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Role does not exist."
                });
                return;
            }
        }
    }
    next();
};

const checkRegistration = {
    checkDuplicates,
    checkRoles
};

module.exports = checkRegistration;

