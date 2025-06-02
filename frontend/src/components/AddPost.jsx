import React, { useState } from 'react'
import { PostData } from '../context/PostContex'

function AddPost({ type }) {
    const [caption, setCaption] = useState("")
    const [file, setFile] = useState("")
    const [filePrev, setFilePrev] = useState("")

    const {addPost}=PostData();
    const changeFileHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFilePrev(reader.result);
            setFile(file);
        }
    }
    const submitHandler = (e) =>{
        e.preventDefault();
        const formdata=new FormData()
        formdata.append('caption',caption)
        formdata.append('file',file)
        addPost(formdata, setFile, setFilePrev, setCaption,type)
    }
    return (
        <>
            <div className="bg-gray-100 w-full flex justify-center pt-6 pb-4">
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-xl mx-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center">
                        Create a {type === 'post' ? 'Post' : 'Reel'}
                    </h2>
                    <form onSubmit={submitHandler} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Enter Caption"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-sm"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                        <input
                            type="file"
                            accept={type === "post" ? "image/*" : "video/*"}
                            onChange={changeFileHandler}
                            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />

                        {filePrev && (
                            <div className="flex justify-center">
                                {type === "post" ? (
                                    <img
                                        src={filePrev}
                                        alt="Preview"
                                        className="h-64 w-auto rounded-lg shadow-md object-cover"
                                    />
                                ) : (
                                    <video controls controlsList="nodownload" src={filePrev} className="w-full max-w-[300px] max-h-[60vh] rounded-lg shadow object-contain"/>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                        >
                            + Add {type === "post" ? <span>Post</span> : <span>Reel</span>}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddPost
