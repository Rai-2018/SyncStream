const mongoose = require("mongoose");

// const User = mongoose.model(
//     "User",
//     new mongoose.Schema({
//         username: String,
//         email: String,
//         password: String,
//         roles:[ {type: mongoose.Schema.Types.ObjectId, ref:"Role"} ]
//     })
// );

const UserSchem = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:[{ type: mongoose.Schema.Types.ObjectId, ref:"Role" }]
});

module.exports = mongoose.model('User', UserSchem);