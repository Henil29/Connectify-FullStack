import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate= useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</p>
      <p className="text-gray-600 text-center max-w-md mb-6">
        Oops! The page you're looking for doesn’t exist or has been moved.
      </p>
      <div onClick={()=>navigate("/")}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-full shadow hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Go Back Home
      </div>
    </div>
  )
}

export default NotFound
