import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserData } from '../context/UserContext';
import { PostData } from '../context/PostContex'
import PostCard from '../components/PostCard';

const Account = ({ user }) => {

    const navigate = useNavigate();
    const { logoutUser } = UserData()
    const { posts, reels } = PostData()

    let myPosts;
    if (posts) {
        myPosts = posts.filter((post) => post.owner._id === user._id);
    }

    let myReels;
    if (reels) {
        myReels = reels.filter((reel) => reel.owner._id === user._id);
    }

    const [type, setType] = useState("post")
    const logoutHandler = () => {
        logoutUser(navigate)
    }
    return (
        <>
            {user && (
                <>

                    <div className="bg-gray-100 flex flex-col gap-4 items-center justify-center pt-3">
                        <div className="bg-white flex justify-between gap-4 p-8 rounded-lg shadow-md max-w-md mt-14">
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
                        <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7 mt-6">
                            <button onClick={()=>{setType('post')}}>Posts</button>
                            <button onClick={()=>{setType('reel')}}>Reels</button>
                        </div>
                        {
                            type === "post" &&
                            <>
                                {
                                    myPosts && myPosts.length > 0 ? myPosts.map((e) => (
                                        <PostCard type={"post"} value={e} key={e._id} />
                                    )) : <p>No post yet</p>
                                }
                            </>
                        }
                        {
                            type === "reel" &&
                            <>
                                {
                                    myReels && myReels.length > 0 ? myReels.map((e) => (
                                        <PostCard type={""} value={e} key={e._id} />
                                    )) : <p>No reels yet</p>
                                }
                            </>
                        }
                    </div>


                </>
            )}
        </>
    )
}

export default Account