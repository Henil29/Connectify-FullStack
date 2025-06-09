import React from 'react'

const Messages = ({ message, ownMessage }) => {
    return (
        <>
            <div className={`mb-2 flex ${ownMessage ? "justify-end" : "justify-start"}`}>
                <span className={`inline-block mx-3 px-4 py-2 rounded-2xl shadow text-base max-w-[70%] break-words ${ownMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                    {message}
                </span>
            </div>
        </>
    )
}

export default Messages