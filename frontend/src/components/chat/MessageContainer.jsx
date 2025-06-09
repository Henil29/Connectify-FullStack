import React, { useEffect, useState } from 'react'
import { UserData } from '../../context/UserContext'
import axios from 'axios'
import { LoadingAnimation } from '../Loading'
import Messages from './Messages'
import MessageInput from './MessageInput'

const MessageContainer = ({ selectedChat, setChats }) => {
    const [messages, setMessages] = useState([])
    const { user } = UserData()
    const [loading, setLoading] = useState(false)

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
    return (
        <div>
            {
                selectedChat && (
                    <div className="flex flex-col h-full">
                        {/* Chat header */}
                        <div className="flex w-full h-14 items-center gap-4 border-b border-gray-200 mb-2 pb-2 px-2 bg-gray-50 rounded-t-xl">
                            <img src={selectedChat.users[0].profilePic.url} className='w-10 h-10 rounded-full border-2 border-blue-200 object-cover' alt="" />
                            <span className="font-semibold text-lg text-gray-700">{selectedChat.users[0].name}</span>
                        </div>
                        {
                            loading ? <LoadingAnimation /> : <>
                                <div className="flex flex-col gap-3 my-2 h-[450px] overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100">
                                    {
                                        messages && messages.map((e) => (
                                            <Messages key={e._id} message={e.text} ownMessage={e.sender === user._id && true} />
                                        ))
                                    }
                                </div>
                                <MessageInput setMessages={setMessages} selectedChat={selectedChat}/>
                            </>
                        }
                    </div>
                )
            }
        </div>
    )
}

export default MessageContainer