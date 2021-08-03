const mongoose = require("mongoose");
const MessageSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    content: {
        type: String,
        required: true,
        minLength: 1,
    },
    room_id: Number,
    userName: String,
});

MessageSchema.statics.create = (content) => {
    let msg = new MessageModel({
        date: new Date(),
        content: content.value,
        room_id: content.room_id,
        userName: content.user_id,
    });

    return msg.save();
}


const MessageModel = mongoose.model("Message", MessageSchema);



module.exports = {
    Schema: MessageSchema,
    Model: MessageModel
}