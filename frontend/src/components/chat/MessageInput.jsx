import React, { useState } from 'react'
import { ChatData } from '../../context/ChatContex'
import toast from 'react-hot-toast';
import axios from 'axios';

const MessageInput = ({setMessages,selectedChat}) => {
    const [textMsg,setTextMsg]=useState("")
    const {setChats} = ChatData();

    const handleMessage = async(e)=>{
        e.preventDefault()
        try {
            const {data}=await axios.post("/api/messages/",{
                message:textMsg,
                reciverId:selectedChat.users[0]._id
            })
            setMessages((message)=>[...message,data])
            setTextMsg("")
            setChats((prev)=>{
                const updatedChat=prev.map((chat)=>{
                    if(chat._id===selectedChat._id){
                        return{
                            ...chat,
                            letestMessage:{
                                text: textMsg,
                                sender: data.sender,
                            }
                        }
                    }
                    return chat
                })
                return updatedChat
            })
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }
  return (
    <div className="mt-2">
        <form onSubmit={handleMessage} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
            <input type="text" placeholder='Type your message...' className='border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition' value={textMsg} onChange={(e)=>setTextMsg(e.target.value)} required/>
            <button type='submit' className='bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition'>Send</button>
        </form>
    </div>
  )
}

export default MessageInput