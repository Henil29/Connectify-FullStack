import React, { useEffect, useRef, useState } from 'react';
import { BsChatFill, BsThreeDotsVertical } from 'react-icons/bs';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { UserData } from '../context/UserContext';
import { PostData } from '../context/PostContex';
import { Link } from 'react-router-dom';
import { LoadingAnimation } from './Loading';
import { MdDelete } from "react-icons/md";
import SimpleModal from './SimpleModal';
import toast from 'react-hot-toast';
import axios from 'axios';

const formatTime = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInMs = now - createdDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return createdDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const PostCard = ({ type, value }) => {
    const [isLike, setIsLike] = useState(false);
    const [show, setShow] = useState(false);
    const { user } = UserData();
    const { likePost, addComment, addLoading, deletePost, loading, fetchPost } = PostData();
    const videoRef = useRef(null);

    useEffect(() => {
        for (let i = 0; i < value.likes.length; i++) {
            if (value.likes[i] === user._id) {
                setIsLike(true);
            }
        }
    }, [value, user._id]);

    useEffect(() => {
        if (videoRef.current) {
            if (show) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(() => { });
            }
        }
    }, [show]);

    const likeHandler = () => {
        setIsLike(!isLike);
        likePost(value._id);
    };

    const [comment, setComment] = useState("")
    const addCommentHandler = (e) => {
        e.preventDefault()
        addComment(value._id, comment, setComment)
    }
    const [showModal, setShowModal] = useState(false)
    const closeModal = () => {
        setShowModal(false)
    }

    const deleteHandler = () => {
        deletePost(value._id)
    }

    const [showInput, setShowInput] = useState(false)
    const editHandler = () => {
        setShowModal(false)
        setShowInput(true)
    }

    const [caption, setCaption] = useState(value.caption ? value.caption : "")
    const [captionLoading, setCaptionLoading] = useState(false)
    async function updateCaption() {
        setCaptionLoading(true)
        try {
            const { data } = await axios.put("/api/post/" + value._id, { caption })
            toast.success(data.message)
            setShowInput(false)
            setCaptionLoading(false)
            fetchPost()
        } catch (error) {
            toast.error(error.response.data.message)
            setCaptionLoading(false)
        }
    }
    return (
        <div className="bg-gray-100 flex items-center justify-center pt-6 pb-16 px-4 relative">
            <SimpleModal isOpen={showModal} onClose={closeModal}>
                <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-xl shadow-lg">
                    <button onClick={editHandler} className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition'>
                        Edit
                    </button>
                    <button onClick={deleteHandler} className='bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition'>
                        Delete
                    </button>
                </div>
            </SimpleModal>

            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-5 relative overflow-hidden">

                {type === 'reel' && show && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-10 rounded-2xl pointer-events-none" />
                )}

                <div className="flex items-center justify-between relative z-20">
                    <div className="flex items-center space-x-3">
                        <Link to={`/user/${value.owner._id}`} className="flex items-center space-x-3">
                            <img src={value.owner.profilePic.url} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="text-gray-900 font-medium text-sm">{value.owner.name}</p>
                                <p className="text-gray-400 text-xs">{formatTime(value.createdAt)}</p>
                            </div>
                        </Link>
                    </div>

                    {value.owner._id === user._id && <button className="hover:bg-gray-100 rounded-full p-2 text-xl text-gray-500">
                        <BsThreeDotsVertical onClick={() => setShowModal(true)} />
                    </button>}
                </div>

                <div className="relative z-20">
                    {showInput ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Enter caption" value={caption} onChange={(e) => setCaption(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button disabled={captionLoading} onClick={updateCaption} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition">
                                    {captionLoading ? <LoadingAnimation /> : "Update Caption"}
                                </button>
                                <button
                                    onClick={() => setShowInput(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md text-sm transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-sm">{value.caption}</p>
                    )}
                </div>


                {type === 'post' ? (
                    <img
                        src={value.post.url}
                        className="rounded-xl"
                    />
                ) : (
                    <div className="relative rounded-xl overflow-hidden z-20">
                        <video
                            ref={videoRef}
                            src={value.post.url}
                            className="w-full h-full object-cover rounded-xl"
                            autoPlay
                            loop
                            muted
                            controls={!show}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600 relative z-20">
                    <div className="flex items-center space-x-2">
                        <span
                            onClick={likeHandler}
                            className="text-2xl cursor-pointer"
                        >
                            {isLike ? (
                                <IoHeart className="text-red-500" />
                            ) : (
                                <IoHeartOutline />
                            )}
                        </span>
                        <button>{value.likes.length} Likes</button>
                    </div>
                    <button
                        onClick={() => setShow(!show)}
                        className="flex items-center space-x-2 px-3 py-1 rounded-full hover:bg-gray-100"
                    >
                        <BsChatFill className="text-gray-500" />
                        <span>{value.comments.length} Comments</span>
                    </button>
                </div>

                {type === 'reel' && (
                    <div
                        className={`absolute bottom-0 left-0 w-full bg-gray-100 text-black shadow-lg p-4 transition-transform duration-300 ease-in-out z-50 ${show ? 'translate-y-0' : 'translate-y-full'
                            }`}
                        style={{ height: '250px', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-semibold text-sm">Comments</h2>
                            <button
                                onClick={() => setShow(false)}
                                className="text-sm bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded"
                            >
                                Close
                            </button>
                        </div>
                        <hr className="border-gray-700" />
                        <div className="mt-2 h-[140px] overflow-y-auto space-y-3 pr-2">
                            {value.comments && value.comments.length > 0 ? (
                                value.comments.map((e) => (
                                    <Comment
                                        value={e}
                                        key={e._id}
                                        user={user}
                                        owner={value.owner._id}
                                        id={value._id}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 mt-4">No comments yet</p>
                            )}
                        </div>
                        <form className="flex gap-3 mb-4" onSubmit={addCommentHandler}>
                            <input
                                type="text" required
                                className="flex-1 border border-gray-700 bg-gray-100 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter comment" value={comment} onChange={e => setComment(e.target.value)}
                            />
                            <button disabled={addLoading} type='submit' className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 text-sm">
                                {addLoading ? <LoadingAnimation /> : "Add"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Post Comments (if not reel) */}
                {type === 'post' && show && (
                    <>
                        <hr className="my-4" />
                        <p className="text-gray-800 font-semibold text-sm">Comments</p>
                        <hr className="my-2" />
                        <div className="mt-2 max-h-32 overflow-y-auto space-y-3">
                            {value.comments && value.comments.length > 0 ? (
                                value.comments.map((e) => (
                                    <Comment
                                        value={e}
                                        key={e._id}
                                        user={user}
                                        owner={value.owner._id}
                                        id={value._id}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No comments yet</p>
                            )}
                        </div>
                        <form className="flex gap-3 mt-3" onSubmit={addCommentHandler}>
                            <input
                                type="text" required
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter comment" value={comment} onChange={e => setComment(e.target.value)}
                            />
                            <button disabled={addLoading} className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 text-sm">
                                {addLoading ? <LoadingAnimation /> : "Add"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default PostCard;

export const Comment = ({ value, user, owner, id }) => {

    const canDelete = user._id === value.user._id || user._id === owner;
    const { deleteComment } = PostData()

    const deleteCommentHandler = () => {
        deleteComment(id, value._id)
    }
    return (
        <div className="flex items-start space-x-3">
            <img src={value.user.profilePic.url} alt={value.user.name} className="w-8 h-8 rounded-full object-cover" />
            <div className="bg-white rounded-md px-2 py-1 flex-1">
                <div className="flex items-center space-x-2">
                    <Link to={`/user/${value.user._id}`}>
                        <p className="text-gray-700 font-medium text-sm">
                            {value.user.name}
                            <span className="text-gray-400 text-xs ml-2">{formatTime(value.createdAt)}</span>
                        </p>
                    </Link>

                    {canDelete && (
                        <button onClick={deleteCommentHandler} className="text-red-500 text-base hover:text-red-600">
                            <MdDelete />
                        </button>
                    )}
                </div>
                <p className="text-gray-900 text-sm">{value.comment}</p>
            </div>
        </div>
    );
};
