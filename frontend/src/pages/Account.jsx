import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext';
import { PostData } from '../context/PostContex';
import PostCard from '../components/PostCard';
import { Loading } from '../components/Loading';
import Modal from '../components/Modal';
import axios from 'axios';

const Account = ({ user }) => {
    const navigate = useNavigate();
    const { logoutUser, updateProfilePic } = UserData();
    const { posts, reels, loading } = PostData();

    const [type, setType] = useState('post');
    const [show, setShow] = useState(false);
    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);
    const [tab, setTab] = useState('followers');
    const [file, setFile] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);

    const logoutHandler = () => {
        logoutUser(navigate);
    };

    const changeFileHandler = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const changeImageHandler = () => {
        if (!file) return;
        const formdata = new FormData();
        formdata.append('file', file);
        updateProfilePic(user._id, formdata,setFile);
        setShowUploadModal(false);
    };

    async function followData() {
        try {
            const { data } = await axios.get(`/api/user/followdata/${user._id}`);
            setFollowersData(data.followers);
            setFollowingData(data.following);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user && user._id) {
            followData();
        }
    }, [user]);

    const myPosts = posts?.filter((post) => post.owner._id === user._id);
    const myReels = reels?.filter((reel) => reel.owner._id === user._id);

    if (loading) return <Loading />;

    return (
        <>
            {user && (
                <>
                    {show && <Modal value={[followersData, followingData]} setShow={setShow} defaultTab={tab} />}

                    {showUploadModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] flex flex-col gap-4 items-center">
                                <h2 className="text-lg font-semibold text-gray-700">Update Profile Picture</h2>
                                <input type="file" onChange={changeFileHandler} className="w-full" />
                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={changeImageHandler}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        onClick={() => setShowUploadModal(false)}
                                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-100 flex flex-col gap-4 items-center justify-center pt-3 px-4 min-h-screen">
                        <div className="bg-white flex justify-between gap-4 p-8 rounded-lg shadow-md max-w-md w-full mt-14">
                            <div className="image flex flex-col items-center gap-4">
                                <img
                                    src={user.profilePic.url}
                                    alt="Profile"
                                    className="w-[180px] h-[180px] rounded-full object-cover shadow-md"
                                />
                            </div>

                            <div className="flex flex-col gap-2 items-center text-center">
                                <p className="text-gray-800 font-semibold">{user.name}</p>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                                <p className="text-gray-500 text-sm">{user.gender}</p>
                                <p
                                    className="text-gray-500 text-sm cursor-pointer"
                                    onClick={() => {
                                        setShow(true);
                                        setTab('followers');
                                    }}
                                >
                                    {user.followers.length} followers
                                </p>
                                <p
                                    className="text-gray-500 text-sm cursor-pointer"
                                    onClick={() => {
                                        setShow(true);
                                        setTab('following');
                                    }}
                                >
                                    {user.following.length} following
                                </p>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-md shadow-sm transition">
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={logoutHandler}
                                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md shadow-sm transition">
                                        Logout
                                    </button>
                                </div>

                            </div>
                        </div>

                        <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7 mt-6 shadow-sm">
                            <button
                                onClick={() => setType('post')}
                                className={`py-2 px-4 rounded-md ${type === 'post'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                    } transition-all duration-200`}
                            >
                                Posts
                            </button>
                            <button
                                onClick={() => setType('reel')}
                                className={`py-2 px-4 rounded-md ${type === 'reel'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                    } transition-all duration-200`}
                            >
                                Reels
                            </button>
                        </div>

                        <div className="mt-4 w-full max-w-md">
                            {type === 'post' ? (
                                myPosts?.length > 0 ? (
                                    myPosts.map((e) => (
                                        <PostCard type="post" value={e} key={e._id} />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">No posts yet</p>
                                )
                            ) : myReels?.length > 0 ? (
                                myReels.map((e) => (
                                    <PostCard type="reel" value={e} key={e._id} />
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No reels yet</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Account;
