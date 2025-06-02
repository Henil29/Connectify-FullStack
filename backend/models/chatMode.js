import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    latestMessage: {
        text: {
            type: String,
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        },
    },
},{timestamps: true});

export const Chat = mongoose.model("Chat", chatSchema);