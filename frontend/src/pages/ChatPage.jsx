import React, { useEffect, useState } from 'react'
import { ChatData } from '../context/ChatContex'
import axios from 'axios'
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Chat from '../components/chat/Chat';
import MessageContainer from '../components/chat/MessageContainer';
import { SocketData } from '../context/SocketContext';

const ChatPage = ({ user }) => {
    const { createChat, selectedChat, setSelectedChat, chats, setChats } = ChatData()
    const [users, setUsers] = useState([])
    const [query, setQuery] = useState("")
    const [search, setSearch] = useState(false)
    const [showChat, setShowChat] = useState(false)

    async function fetchAllUsers() {
        try {
            const { data } = await axios.get('/api/user/all?search=' + query)
            setUsers(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllChats = async () => {
        try {
            const { data } = await axios.get("/api/messages/chats")
            setChats(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllUsers()
    }, [query])

    useEffect(() => {
        getAllChats()
    }, [])

    async function createNewChat(id) {
        await createChat(id)
        setSearch(false)
        getAllChats()
    }

    const { onlineUsers } = SocketData()

    return (
        <div className="w-full max-w-[1600px] flex bg-white px-2 mt-2 overflow-hidden">
            {/* Sidebar */}
            <div className={`group relative transition-all duration-300 ease-in-out h-[89vh] bg-[#f7f8fa] rounded-2xl p-2 shadow border border-gray-200 
                ${showChat ? 'hidden md:block' : 'w-full md:w-[80px]'} 
                md:hover:w-[340px]
                lg:w-[340px] lg:hover:w-[340px] 
                flex flex-col overflow-hidden z-20`}>
                <div className="flex items-center justify-between mb-4 px-2">
                    <button className='bg-blue-500 text-white p-2 md:p-3 rounded-full shadow hover:bg-blue-600 transition' onClick={() => setSearch(!search)}>
                        {search ? <MdClose size={20} className="md:text-[22px]" /> : <FaSearch size={18} className="md:text-[20px]" />}
                    </button>
                    <span className="font-bold text-base md:text-lg text-gray-700 hidden md:group-hover:block">Chats</span>
                </div>

                {search ? (
                    <>
                        <input
                            className='border border-gray-300 rounded-lg px-2 md:px-3 py-1.5 md:py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm md:text-base'
                            placeholder='Search users...'
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        <div className="overflow-y-auto max-h-[calc(89vh-180px)] md:max-h-[calc(89vh-200px)] pr-2">
                            {users && users.length > 0 ? users.map((e) => (
                                <div
                                    key={e._id}
                                    onClick={() => createNewChat(e._id)}
                                    className="bg-white p-2 md:p-3 mb-2 rounded-xl cursor-pointer flex items-center gap-3 md:gap-4 hover:bg-blue-50 transition-all duration-200 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 group"
                                >
                                    <div className="relative">
                                        <img
                                            src={e.profilePic.url}
                                            alt={e.name}
                                            className='w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-300 transition-all duration-200'
                                        />
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="hidden md:group-hover:flex flex-col">
                                        <span className="font-semibold text-sm md:text-base text-gray-800 group-hover:text-blue-600 transition-colors">{e.name}</span>
                                        <span className="text-xs md:text-sm text-gray-500">Click to start chat</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-400 text-center text-sm md:text-base">No users</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className='flex flex-col gap-2 overflow-y-auto pr-2 max-h-[calc(89vh-100px)] md:max-h-[calc(89vh-120px)]'>
                        {chats.map(e => (
                            <Chat
                                key={e._id}
                                chat={e}
                                setSelectedChat={(chat) => {
                                    setSelectedChat(chat);
                                    setShowChat(true);
                                }}
                                isOnline={onlineUsers.includes(e.users[0]._id)}
                                showDetails={false}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Main Chat Area */}
            <div className={`transition-all duration-300 ease-in-out h-[89vh] bg-[#f7f8fa] rounded-2xl flex flex-col shadow border border-gray-200 p-0 
                ${showChat ? 'w-full md:w-[calc(100%-80px)]' : 'hidden md:block md:w-[calc(100%-80px)]'} 
                md:group-hover:w-[calc(100%-340px)]
                lg:w-[calc(100%-340px)] lg:group-hover:w-[calc(100%-340px)]`}>
                {selectedChat === null ? (
                    <div className="w-full h-full flex flex-col justify-center items-center text-xl md:text-2xl text-gray-500 bg-[#f7f8fa] rounded-2xl">
                        <span>Hi👋.. <span className="font-semibold text-blue-500">{user.name}</span></span>
                        <span className="mt-2 text-sm md:text-base text-gray-400">Select a chat or start a new conversation</span>
                    </div>
                ) : (
                    <div className="w-full h-full bg-[#f7f8fa] flex flex-col rounded-2xl">
                        {/* Chat header with back button - only visible on small screens */}
                        <div className="md:hidden flex w-full h-14 items-center gap-4 border-b border-gray-200 px-2 bg-gray-50 rounded-t-xl relative">
                            <button 
                                onClick={() => setShowChat(false)}
                                className="absolute left-2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex items-center gap-4 w-full pl-10">
                                <img src={selectedChat.users[0].profilePic.url} className='w-10 h-10 rounded-full border-2 border-blue-200 object-cover' alt="" />
                                <span className="font-semibold text-lg text-gray-700">{selectedChat.users[0].name}</span>
                            </div>
                        </div>
                        <MessageContainer selectedChat={selectedChat} setChats={setChats} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatPage