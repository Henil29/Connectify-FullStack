import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text:{
        type: String
    }
},{timestamps: true});

export const Message = mongoose.model("Message", messageSchema);