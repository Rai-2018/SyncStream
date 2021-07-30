const mongoose =require('mongoose');
// define data schema
const Msg = mongoose.model(
    "Chat",
    new mongoose.Schema({
        userName: String,
        message: String,
})
);
//data collection 
// const Msg = mongoose.model('msg',Chat);
module.exports = Msg