import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserData } from '../context/UserContext';

const Account = ({ user }) => {


    const navigate = useNavigate();

    const { logoutUser } = UserData()

    const logoutHandler = () => {
        logoutUser(navigate)
    }
    return (
        <>
            {user && <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14">
                <div className="bg-white flex justify-between gap-4 p-8 rounded-lg shadow-md max-w-md">
                    <div className="image flex flex-col justify-between mb-4 gap-4">
                        <img src={user.profilePic.url} alt="" className="w-[180px] h-[180px] rounded-full object-cover shadow-md"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className='text-gray-800 font-semibold '>{user.name}</p>
                        <p className='text-gray-500 text-sm'>{user.email}</p>
                        <p className='text-gray-500 text-sm'>{user.gender}</p>
                        <p className='text-gray-500 text-sm'>{user.followers.length} followers</p>
                        <p className='text-gray-500 text-sm'>{user.following.length} following</p>
                        <button onClick={logoutHandler} className="mt-4 w-28 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition duration-200">Logout</button>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Account