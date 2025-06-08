import React, { useEffect, useState } from 'react'
import { ChatData } from '../context/ChatContex'
import axios from 'axios'
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Chat from '../components/chat/Chat';

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
            const { data } = await axios.get("/api/message/chats")
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
    return (
        <div className='w-[100%] md:w-[750px] md:p-4'>
            <div className="flex gap-4 mx-auto">
                <div className="w-[30%]">
                    <div className="top">
                        <button className='bg-blue-500 text-white px-3 py-3 rounded-full' onClick={() => setSearch(!search)}>{search ? <MdClose /> : <FaSearch />}</button>
                        {
                            search ? <>
                                <input className='custom-input' style={{ width: "100px",border: 'gray solid 1px' }} placeholder='Enter name' value={query} onChange={e => setQuery(e.target.value)} />
                                <div className="users">
                                    {users && users.length > 0 ? users.map((e) => (
                                        <div
                                            key={e._id}
                                            className="bg-gray-200 text-black p-2 mt-2 rounded cursor-pointer flex items-center gap-2 hover:bg-gray-300"
                                        >
                                            <img
                                                src={e.profilePic.url}
                                                alt={e.name}
                                                className='w-8 h-8 rounded-full object-cover'
                                            />
                                            <span>{e.name}</span>
                                        </div>
                                    )) :
                                        <p>No users</p>}
                                </div>
                            </> : <div className='flex flex-col justify-center items-center mt-2'>
                                {
                                    chats.map(e => (
                                        <Chat key={e._id} chat={e} setSelectedChat={setSelectedChat}/>
                                    ))
                                }
                            </div>
                        }
                    </div>
                </div>
                {
                    selectedChat === null ? <div className="w-[70%]">Hi👋.. {user.name}</div>:
                    <div className="w-[70%]"></div>

                }
            </div>
        </div>
    )
}

export default ChatPage