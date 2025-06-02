import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const PostContex = createContext()

export const PostContexProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [reels, setReels] = useState([])

    async function fetchPost() {
        try {
            const { data } = await axios.get("/api/post/all")

            setPosts(data.posts)
            setReels(data.reels)
        } catch (error) {
            console.log(error)
        }
    }
    async function addPost(formdata, setFile, setFilePrev, setCaption, type) {
        try {
            const { data } = await axios.post('/api/post/new?type=' + type, formdata)
            toast.success(data.message)
            fetchPost()
            setFile(null)
            setFilePrev(null)
            setCaption("")

        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    async function likePost(id) {
        try {
            const { data } = await axios.post("/api/post/like/" + id)

            toast.success(data.message)
            fetchPost()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    async function addComment(id,comment,setComment){
        try {
            const { data } = await axios.post("/api/post/comment/" + id,{
                comment,
            })
            toast.success(data.message)
            fetchPost()
            setComment("")

            
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        fetchPost()
    }, [])
    return <PostContex.Provider value={{ reels, posts, addPost, likePost,addComment }}>{children}</PostContex.Provider>
}

export const PostData = () => useContext(PostContex)