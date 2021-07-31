const db = require("../models");
var Room = db.Room;

exports.createroom = (req, res) => {
    const room = new Room({
        userName: req.body.username,
        room_id: req.body.room_id,
        room_name: req.body.roomname
    });

    room.save((err, room) => {
        if(err){
            console.log("1--");
            return res.status(500).send({ message: "duplicate" });
        }

        return res.status(200).send({ message: room.room_id });
    })
	
}


exports.joinroom = (req, res) => {
    
    Room.find({room_name: req.body.roomname}, (err, role) => {
        if(err){
            console.log("1--");
            return res.status(500).send({ message: "nonexist" });
        }

        if(!role[0]){
            return res.status(200).send({ message: "nonexist" });
        } else {
            return res.status(200).send({ message: role[0].room_id });
        }
    })
    
}



exports.check = (req, res) => {
    Room.find({room_id: req.body.room_id}, (err, role) => {
        if(err){
            console.log("1--");
            return res.status(500).send({ message: "nonexist" });
        }

        if(!role[0]){
            return res.status(200).send({ message: "nonexist" });
        } else {
            return res.status(200).send({ message: role[0].userName });
        }
    })
    
}