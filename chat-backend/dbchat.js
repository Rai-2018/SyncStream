import mongoose from 'mongoose';
// define data schema
const chatSchema = mongoose.Schema({
    comment: String,
    user_name: String,
    timestamp: String,
    received: Boolean,
});
//data collection 
export default mongoose.model('commentcontents', chatSchema)