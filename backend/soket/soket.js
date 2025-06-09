import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin:"*",
        methods: ["GET","POST"]
    }
})
export const getReciverSocketId=(reciverId)=>{
    return userSocketMap[reciverId]
}
const userSocketMap = {};

io.on("connection",(socket)=>{
    console.log("user connected",socket.id)

    const userId = socket.handshake.query.userId;

    if(userId != "undefined") userSocketMap[userId]=socket.id;

    io.emit("getOnlineUser",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("User disconnected")
        delete userSocketMap[userId]
        io.emit("getOnlineUser", Object.keys(userSocketMap))
    })
})

export {io,server,app}