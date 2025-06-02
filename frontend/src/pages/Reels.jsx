import React, { useState } from 'react'
import AddPost from '../components/AddPost'
import { PostData } from '../context/PostContex'
import PostCard from '../components/PostCard'
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";

const Reels = () => {
    const { reels } = PostData()
    const [index, setIndex] = useState(0)
    
    const prevReel = () => {
        if (index === 0) {
            setIndex(reels.length - 1)
        }
        else {
            setIndex(index - 1)
        }
    }
    const nextReel = () => {
        if (index === reels.length - 1) {
            setIndex(0)
        }
        else {
            setIndex(index + 1)
        }
    }
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <AddPost type="reel" />

                <div className="mt-8 relative">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mx-auto max-w-[500px]">
                        {reels && reels.length > 0 ? (
                            <PostCard key={reels[index]._id} value={reels[index]} type={'reel'} />
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-gray-500 text-lg font-medium">No reels yet</p>
                                <p className="text-gray-400 mt-2">Be the first to share a reel!</p>
                            </div>
                        )}
                    </div>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                        <button onClick={prevReel} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
                            <FaArrowUp className="w-5 h-5" />
                        </button>
                        <button onClick={nextReel} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
                            <FaArrowDownLong className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reels