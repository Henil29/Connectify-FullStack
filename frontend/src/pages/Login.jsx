import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext.jsx';
import { PostData } from '../context/PostContex.jsx';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loginUser, loading } = UserData()
  const {fetchPost}= PostData()
  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, password, navigate,fetchPost)

  }
  return (
    <>
      {
        loading ? <h1>Loading....</h1> :
          <div className="flex justify-center items-center min-h-screen px-4 py-8">
            <div className="flex flex-col justify-center items-center md:flex-row shadow-lg rounded-xl w-full max-w-4xl bg-white overflow-hidden">
              <div className="w-full md:w-3/4 p-4 sm:p-6 md:p-8">
                <div className="text-center mb-6 md:mb-8">
                  <h1 className="font-semibold text-2xl sm:text-3xl text-gray-700">
                    Login to Connectify
                  </h1>
                </div>
                <form onSubmit={submitHandler} className="w-full max-w-sm mx-auto">
                  <div className="flex flex-col space-y-4 sm:space-y-6">
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base" 
                      required 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base" 
                      required 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                    />
                    <button 
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm sm:text-base"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
              <div className="w-full md:w-1/3 bg-gradient-to-l from-blue-400 to-yellow-400 p-6 sm:p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-white text-center space-y-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Don't have an account?</h1>
                  <p className="text-sm sm:text-base">Join our community today!</p>
                  <Link 
                    to="/register" 
                    className="inline-block bg-white text-blue-500 font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition duration-200 text-sm sm:text-base"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default Login