const config = require("../config/authKey");
const db = require("../models");
var User = db.user;
var Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)

    });

    user.save((err, user) => {
        if(err){
            console.log("1--");
            return res.status(500).send({ message: err });
        } 

        if(req.body.roles) {
            Role.find(
                {name: { $in: req.body.roles }},
                (err, roles) => {
                    if(err) {
                        console.log("2");

                        return res.status(500).send({ message: err });
                    }
                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if(err) {
                            console.log("3");

                            return res.status(500).send({ message: err });
                        }
                        res.send({ message: "Registration success" });
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if(err) {
                    console.log("4");

                    return res.status(500).send({ message: err });
                }
                user.roles = [role._id];
                user.save(err => {
                    if(err) {
                        console.log("5");

                        return res.status(500).send({ message: err });
                    }
                    res.send({ message: "Registration success" });
                });
            });
        }
    });
};



exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
      .populate("roles", "-__v")
      .exec((err, user) => {

        if(err) {
            console.log("signing error at beginning ");
            return res.status(500).send({ message: err });
        }

        if(!user) {
            return res.status(404).send({ message: "Cannot find user" });
        }

        var passwordValidation = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordValidation) {
            return res.status(401).send({ accessToken:null, message: "Wrong password"});
        }

        var token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
        var auth = [];
        for(let i = 0; i < user.roles.length; i++) {
            auth.push("ROLE_"+user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: auth,
            accessToken: token
        });
    });
};

// exports.deleteUser = async(req,res,next)=>{
//     try{
//         const userID = req.
//     }
// }