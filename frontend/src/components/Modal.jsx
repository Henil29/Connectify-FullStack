import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Modal = ({ value, setShow, defaultTab = 'followers' }) => {
    const [followers, following] = value;
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Prevent scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const data = activeTab === 'followers' ? followers : following;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-sm max-h-[80vh] overflow-y-auto p-4">

                {/* Close */}
                <button
                    onClick={() => setShow(false)}
                    className="absolute top-2 right-3 text-gray-500 text-2xl hover:text-gray-700"
                >
                    &times;
                </button>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        className={`px-3 py-1 rounded-md font-medium transition ${
                            activeTab === 'followers' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setActiveTab('followers')}
                    >
                        Followers
                    </button>
                    <button
                        className={`px-3 py-1 rounded-md font-medium transition ${
                            activeTab === 'following' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setActiveTab('following')}
                    >
                        Following
                    </button>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {data && data.length > 0 ? (
                        data.map((e) => (
                            <Link
                                key={e._id}
                                onClick={() => setShow(false)}
                                to={`/user/${e._id}`}
                                className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md transition"
                            >
                                <img
                                    src={e.profilePic.url}
                                    alt={e.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="text-gray-800 font-medium">{e.name}</span>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No {activeTab} found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
