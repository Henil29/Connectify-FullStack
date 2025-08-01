import React from 'react'
import { UserData } from '../../context/UserContext'
import { BsInbox, BsSendCheck } from "react-icons/bs";

const Chat = ({ chat, setSelectedChat, isOnline }) => {
    const { user: loggedInUser } = UserData()
    let user
    if (chat) user = chat.users[0]

    const message = chat.latestMessage.text
    const displayMessage = message.length > 18 ? message.slice(0, 18) + '...' : message

    return (
        <>
            {
                user && (
                    <div
                        onClick={() => setSelectedChat(chat)}
                        className="bg-white py-2 px-2 md:px-3 rounded-xl cursor-pointer mb-3 shadow-sm hover:shadow-md border border-gray-200 transition group flex items-center gap-3"
                    >
                        <div className="flex-shrink-0">
                            <img src={user.profilePic.url} className="w-12 h-12 rounded-full border-2 border-green-200 object-cover" />
                        </div>
                        <div className="hidden md:group-hover:flex md:flex flex-col justify-center overflow-hidden">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">{user.name}</span>
                                {isOnline && (
                                    <div className="text-xl font-bold text-green-400 leading-none">•</div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                {loggedInUser._id === chat.latestMessage.sender && <BsSendCheck className="text-blue-500" />}
                                <span className="truncate max-w-[180px]">{displayMessage}</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Chat
