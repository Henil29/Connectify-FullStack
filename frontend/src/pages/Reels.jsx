import React, { useState } from 'react'
import AddPost from '../components/AddPost'
import { PostData } from '../context/PostContex'
import PostCard from '../components/PostCard'
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";
import { Loading } from '../components/Loading';

const Reels = () => {
    const { reels, loading } = PostData()
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
    if (loading) {
        return <Loading/>
    }
    return (
        <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-2 sm:px-4">
            <div className="max-w-4xl mx-auto">
                <AddPost type="reel" />

                <div className="mt-4 sm:mt-8 relative">
                    <div className="md:bg-white md:rounded-xl md:shadow-lg overflow-hidden mx-auto max-w-[500px]">
                        {reels && reels.length > 0 ? (
                            <PostCard key={reels[index]._id} value={reels[index]} type={'reel'} />
                        ) : (
                            <div className="p-4 sm:p-8 text-center bg-white rounded-xl shadow-lg">
                                <p className="text-gray-500 text-base sm:text-lg font-medium">No reels yet</p>
                                <p className="text-gray-400 mt-2 text-sm sm:text-base">Be the first to share a reel!</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation buttons - Side on desktop, bottom on mobile */}
                    <div className="md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2 flex md:flex-col gap-3 sm:gap-4 mt-2 sm:mt-0 md:mt-0 justify-center md:justify-start mb-16 sm:mb-0">
                        <button 
                            onClick={prevReel} 
                            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 sm:p-2.5 md:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-0 md:flex-col px-2.5 sm:px-4 md:px-3"
                        >
                            <FaArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            <span className="text-xs sm:text-sm md:hidden">Previous</span>
                        </button>
                        <button 
                            onClick={nextReel} 
                            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 sm:p-2.5 md:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-0 md:flex-col px-2.5 sm:px-4 md:px-3"
                        >
                            <FaArrowDownLong className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            <span className="text-xs sm:text-sm md:hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reels