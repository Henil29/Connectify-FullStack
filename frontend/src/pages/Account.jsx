import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext';
import { PostData } from '../context/PostContex';
import PostCard from '../components/PostCard';
import { Loading } from '../components/Loading';
import Modal from '../components/Modal';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import toast from 'react-hot-toast';

const Account = ({ user }) => {
    const navigate = useNavigate();
    const { logoutUser, updateProfilePic } = UserData();
    const { posts, reels, loading, fetchPost } = PostData();

    const [type, setType] = useState('post');
    const [show, setShow] = useState(false);
    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);
    const [tab, setTab] = useState('followers');
    const [file, setFile] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [updatedName, setUpdatedName] = useState(user.name);

    const logoutHandler = () => {
        logoutUser(navigate);
    };

    const changeFileHandler = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const changeImageHandler = () => {
        if (!file && !updatedName.trim()) return;

        const formdata = new FormData();
        if (file) formdata.append('file', file);
        if (updatedName.trim()) formdata.append('name', updatedName.trim());

        updateProfilePic(user._id, formdata, fetchPost);
        setShowUploadModal(false);
        setUpdatedName('');
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
    async function updatePassword(e) {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/user/" + user._id, { oldPassword, newPassword })
            toast.success(data.message)
            setOldPassword('')
            setNewPassword('')
            setShowPasswordModal(false)

        } catch (error) {
            toast.error(error.response.data.message)
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

                    {/* Update Profile Modal */}
                    {showUploadModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] flex flex-col gap-4 items-center">
                                <h2 className="text-lg font-semibold text-gray-700">Update Profile</h2>

                                <input
                                    type="text"
                                    placeholder="Enter new name"
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                    className="w-full border px-2 py-1 rounded-md"
                                />

                                <input type="file" onChange={changeFileHandler} className="w-full" />

                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={changeImageHandler}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md">
                                        Submit
                                    </button>
                                    <button
                                        onClick={() => setShowUploadModal(false)}
                                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-md">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Update Password Modal */}
                    {showPasswordModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] flex flex-col gap-4 items-center">
                                <h2 className="text-lg font-semibold text-gray-700">Update Password</h2>
                                <form
                                    onSubmit={updatePassword}
                                    className="w-[300px] px-4 py-1 flex flex-col items-center gap-4 mt-2"
                                >
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full border border-gray-300 px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full border border-gray-300 px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />

                                    <div className="flex gap-3 justify-center mt-2">
                                        <button
                                            type="submit"
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md font-medium shadow-sm transition"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordModal(false)}
                                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1.5 rounded-md font-medium shadow-sm transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    )}

                    {/* Main Account Section */}
                    <div className="bg-gray-100 flex flex-col gap-4 items-center justify-center pt-3 px-4 min-h-screen">
                        <div className="bg-white flex justify-between gap-4 p-8 rounded-lg shadow-md max-w-md w-full mt-14">
                            <div className="image flex flex-col items-center gap-4">
                                <div className="w-[180px] h-[180px] rounded-full overflow-hidden shadow-md">
                                    <img
                                        src={user.profilePic.url}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
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

                                {/* Buttons */}
                                <div className="flex flex-col gap-2 mt-4">
                                    <div className="flex gap-3 justify-center flex-wrap">
                                        <button
                                            onClick={() => setShowUploadModal(true)}
                                            className="bg-blue-500 flex gap-1 justify-center items-center hover:bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-md shadow-sm transition">
                                            Edit Bio <MdEdit />
                                        </button>

                                        <button
                                            onClick={logoutHandler}
                                            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md shadow-sm transition">
                                            Logout
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-3 py-1.5 rounded-md shadow-sm transition self-center">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Post/Reel Toggle */}
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

                        {/* Post/Reel Content */}
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
