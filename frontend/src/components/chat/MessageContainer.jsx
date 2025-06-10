import { useEffect, useRef, useState } from 'react'
import { UserData } from '../../context/UserContext'
import axios from 'axios'
import { LoadingAnimation } from '../Loading'
import Messages from './Messages'
import MessageInput from './MessageInput'
import { SocketData } from '../../context/SocketContext'

const MessageContainer = ({ selectedChat, setChats }) => {
    const [messages, setMessages] = useState([])
    const { user } = UserData()
    const [loading, setLoading] = useState(false)
    const { socket } = SocketData()

    useEffect(() => {
        socket.on("newMessage", (message) => {
            if (selectedChat._id === message.chatId) {
                setMessages((prev) => [...prev, message])
            }

            setChats((prev) => {
                const updatedChat = prev.map((chat) => {
                    if (chat._id === message.chatId) {
                        return {
                            ...chat,
                            latestMessage: {
                                text: message.text,
                                sender: message.sender,
                            }
                        }
                    }
                    return chat;
                })
                return updatedChat;
            })
        })
        return () => socket.off("newMessage")
    }, [socket, selectedChat, setChats])

    async function fetchMessages() {
        setLoading(true)
        try {
            const { data } = await axios.get("/api/messages/" + selectedChat.users[0]._id)
            setMessages(data.messages)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchMessages()
    }, [selectedChat])

    const messageContainerRef = useRef(null)

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="h-full">
            {
                selectedChat && (
                    <div className="flex flex-col h-full">
                        {/* Chat header */}
                        <div className="flex w-full h-14 items-center gap-4 border-b border-gray-200 px-2 bg-gray-50 rounded-t-xl">
                            <img src={selectedChat.users[0].profilePic.url} className='w-10 h-10 rounded-full border-2 border-blue-200 object-cover' alt="" />
                            <span className="font-semibold text-lg text-gray-700">{selectedChat.users[0].name}</span>
                        </div>

                        {loading ? <LoadingAnimation /> : (
                            <>
                                {/* Messages container takes available space */}
                                <div ref={messageContainerRef} className="flex-1 overflow-y-auto px-1 py-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100">
                                    {messages.map((e) => (
                                        <Messages key={e._id} message={e.text} ownMessage={e.sender === user._id} />
                                    ))}
                                </div>

                                {/* Input stays pinned at the bottom */}
                                <MessageInput setMessages={setMessages} selectedChat={selectedChat} />
                            </>
                        )}
                    </div>
                )
            }
        </div>
    )

}

export default MessageContainer