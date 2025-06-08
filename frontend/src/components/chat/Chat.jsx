import React from 'react'
import { UserData } from '../../context/UserContext'
import { BsSendCheck } from "react-icons/bs";
const Chat = ({ chat, setSelectedChat }) => {
    const { user: loggedInUser } = UserData();
    let user;
    if (chat) user = chat.users[0]
    return (
        <div>
            {
                user && (
                    <div onClick={() => setSelectedChat(chat)} className="bg-gray-200 py-2 px-1 rounded-md cursor-pointer">
                        <div className="flex justify-center items-center gap-2">
                            <div className="text-5xl font-bold text-green-400">.</div>
                            <img src={user.profilePic.url} className='w-8 h-8 rounded-full' />
                            <span>{user.name}</span>
                        </div>

                        <span className='flex justify-center items-center gap-1'>
                            {loggedInUser._id === chat.latestMessage.sender? <BsSendCheck />:""}
                            {chat.latestMessage.text.slice(0,18)}...
                        </span>
                    </div>
                )
            }
        </div>
    )
}

export default Chat