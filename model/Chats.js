const { Schema, default: mongoose } = require("mongoose");

const ChatSchema = new Schema({
    chatRoomId: {
        type: String,
        required: true,
    },
    userMsgData: [{
        userId: {
            type: String,
        },
        userMsg: {
            type: String,
        },
        userMsgTime: {
            type: Date,
        }
    }],
    adminMsgData: [{
        adminId: {
            type: String,
        },
        adminMsg: {
            type: String,
        },
        adminMsgTime: {
            type: Date,
        }
    }]
});

exports.Chat = mongoose.model('Chat', ChatSchema)