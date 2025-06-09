import { Chat } from "../models/chatMode.js";
import { Message } from "../models/messages.js";
import tryCatch from "../utils/tryCatch.js";

export const sendMessage = tryCatch(async (req, res) => {
    const { reciverId, message } = req.body;

    const senderId = req.user._id;
    if (!reciverId || !message) {
        return res.status(400).json({
            message: "Recipient ID or message are required"
        });
    }
    let chat = await Chat.findOne({
        users: { $all: [senderId, reciverId] }
    });

    if (!chat) {
        chat = new Chat({
            users: [senderId, reciverId],
            latestMessage: {
                text: message,
                sender: senderId
            }
        })
        await chat.save();
    }
    const newMessage = new Message({
        chatId: chat._id,
        sender: senderId,
        text: message
    })
    await newMessage.save();
    await chat.updateOne({
        latestMessage: {
            text: message,
            sender: senderId
        }
    });
    res.status(201).json({
        message: "Message sent successfully",
        newMessage
    });
})

export const getAllMessages = tryCatch(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
        users: { $all: [userId, id] },
    })
    if (!chat) {
        return res.status(404).json({
            message: "Chat not found with this user"
        });
    }
    const messages = await Message.find({
        chatId: chat._id,
    });
    res.status(200).json({
        messages
    });
})

export const getAllChats = tryCatch(async (req, res) => {
    const chats = await Chat.find({
        users: req.user._id
    }).populate({
        path: "users",
        select: "name profilePic"
    });
    chats.forEach((e) => {
        e.users = e.users.filter(
            (user) => user._id.toString() !== req.user._id.toString()
        );
    });
    res.json(chats);
})