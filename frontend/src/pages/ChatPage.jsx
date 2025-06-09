import React, { useEffect, useState } from 'react'
import { ChatData } from '../context/ChatContex'
import axios from 'axios'
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Chat from '../components/chat/Chat';
import MessageContainer from '../components/chat/MessageContainer';
import { SocketData } from '../context/SocketContext';

const ChatPage = ({user}) => {
    const { createChat, selectedChat, setSelectedChat, chats, setChats } = ChatData()
    const [users, setUsers] = useState([])
    const [query, setQuery] = useState("")
    const [search, setSearch] = useState(false)

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
        fetchAllUsers();
    }, [query])
    useEffect(() => {
        getAllChats()
    }, [])

    async function createNewChat(id){
        await createChat(id)
        setSearch(false)
        getAllChats();
    }
    const {onlineUsers,socket} = SocketData()
    return (
        <div className='w-full max-w-[1600px] flex bg-white px-4 mt-2'>
            {/* Sidebar */}
            <div className="w-[340px] h-[89vh] bg-[#f7f8fa] rounded-2xl flex flex-col p-4 overflow-y-auto shadow border border-gray-200 mr-6">
                <div className="flex items-center justify-between mb-4">
                    <button className='bg-blue-500 text-white p-3 rounded-full shadow hover:bg-blue-600 transition' onClick={() => setSearch(!search)}>{search ? <MdClose size={22}/> : <FaSearch size={20}/>}</button>
                    <span className="font-bold text-lg text-gray-700">Chats</span>
                </div>
                {
                    search ? <>
                        <input className='border border-gray-300 rounded-lg px-3 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition' placeholder='Search users...' value={query} onChange={e => setQuery(e.target.value)} />
                        <div className="overflow-y-auto max-h-72 pr-2">
                            {users && users.length > 0 ? users.map((e) => (
                                <div
                                    key={e._id}
                                    onClick={()=>createNewChat(e._id)}
                                    className="bg-white p-3 mb-2 rounded-xl cursor-pointer flex items-center gap-4 hover:bg-blue-50 transition-all duration-200 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 group"
                                >
                                    <div className="relative">
                                        <img
                                            src={e.profilePic.url}
                                            alt={e.name}
                                            className='w-12 h-12 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-300 transition-all duration-200'
                                        />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{e.name}</span>
                                        <span className="text-sm text-gray-500">Click to start chat</span>
                                    </div>
                                </div>
                            )) :
                                <p className="text-gray-400 text-center">No users</p>}
                        </div>
                    </> : <div className='flex flex-col gap-2 overflow-y-auto pr-2'>
                        {
                            chats.map(e => (
                                <Chat key={e._id} chat={e} setSelectedChat={setSelectedChat} isOnline={onlineUsers.includes(e.users[0]._id)}/>
                            ))
                        }
                    </div>
                }
            </div>
            {/* Main Chat Area */}
            <div className="w-[calc(100%-300px)] h-[89vh] bg-[#f7f8fa] rounded-2xl flex flex-col shadow border border-gray-200 p-0">
                    {
                    selectedChat === null ? 
                    <div className="w-full h-full flex flex-col justify-center items-center text-2xl text-gray-500 bg-[#f7f8fa] rounded-2xl">
                        <span>Hi👋.. <span className="font-semibold text-blue-500">{user.name}</span></span>
                        <span className="mt-2 text-base text-gray-400">Select a chat or start a new conversation</span>
                    </div>:
                    <div className="w-full h-full bg-[#f7f8fa] flex flex-col rounded-2xl">
                        <MessageContainer selectedChat={selectedChat} setChats={setChats}/>
                    </div>
                }
            </div>
        </div>
    )
}

export default ChatPage