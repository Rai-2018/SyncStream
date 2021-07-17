const mongoose =require('mongoose');
// define data schema
const chatSchema = mongoose.Schema({
    comment: String,
    user_name: String,
    timestamp: String,
    received: Boolean,
});

//data collection 
module.exports = mongoose.model('commentcontents', chatSchema)