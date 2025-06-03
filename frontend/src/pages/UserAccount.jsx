import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PostData } from '../context/PostContex'
import PostCard from '../components/PostCard';
import axios from 'axios';
import { Loading } from '../components/Loading';
import { UserData } from '../context/UserContext';

const UserAccount = ({ user: loggedInUser }) => {

    const navigate = useNavigate();
    const { posts, reels } = PostData()
    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(true)
    const params = useParams()

    async function fetchUser() {
        try {
            const { data } = await axios.get("/api/user/" + params.id)

            setUser(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchUser()
    }, [])

    let myPosts;
    if (posts) {
        myPosts = posts.filter((post) => post.owner._id === user._id);
    }

    let myReels;
    if (reels) {
        myReels = reels.filter((reel) => reel.owner._id === user._id);
    }

    const [type, setType] = useState("post")
    const [followed, setFollowed] = useState(false)
    const followers = user.followers

    const { followUser } = UserData();
    const followHandler = () => {
        setFollowed(!followed)
        followUser(user._id, fetchUser)
    }

    useEffect(() => {
        if (followers && followers.includes(loggedInUser._id)) {
            setFollowed(true)
        }
    }, [user])
    if (loading) {
        return <Loading />
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
                                {
                                    user._id === loggedInUser._id ? "" :
                                        <>
                                            <div className="flex gap-4 mt-2">
                                                <button
                                                    onClick={followHandler}
                                                    className={`min-w-[80px] px-2 py-2 text-white rounded-lg transition duration-200 flex justify-center items-center ${followed ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                                                        }`}
                                                >
                                                    {followed ? 'Unfollow' : 'Follow'}
                                                </button>
                                                
                                                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200">
                                                    Message
                                                </button>
                                            </div>
                                        </>
                                }

                            </div>
                        </div>
                        <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7 mt-6">
                            <button onClick={() => { setType('post') }}>Posts</button>
                            <button onClick={() => { setType('reel') }}>Reels</button>
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

export default UserAccount