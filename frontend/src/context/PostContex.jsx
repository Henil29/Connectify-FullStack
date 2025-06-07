import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const PostContex = createContext()

export const PostContexProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [reels, setReels] = useState([])
    const [loading, setLoading] = useState(true)
    async function fetchPost() {
        try {
            const { data } = await axios.get("/api/post/all")

            setPosts(data.posts)
            setReels(data.reels)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const [addLoading,setAddLoading]=useState(false)
    async function addPost(formdata, setFile, setFilePrev, setCaption, type) {
        setAddLoading(true)
        try {
            const { data } = await axios.post('/api/post/new?type=' + type, formdata)
            toast.success(data.message)
            fetchPost()
            setFile(null)
            setFilePrev(null)
            setCaption("")
            setAddLoading(false)
        } catch (error) {
            toast.error(error.response.data.message)
            setAddLoading(false)
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
    async function addComment(id, comment, setComment) {
        setAddLoading(true)
        try {
            const { data } = await axios.post("/api/post/comment/" + id, {
                comment,
            })
            toast.success(data.message)
            fetchPost()
            setComment("")
            setAddLoading(false)

        } catch (error) {
            toast.error(error.response.data.message)
            setAddLoading(false)
        }
    }
    async function deletePost(id) {
        setLoading(true)
        try {
            const{data}=await axios.delete("/api/post/"+id)
            toast.success(data.message)
            fetchPost()
            setLoading(false)
        } catch (error) {
            toast.error(error.response.data.message)
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchPost()
    }, [])
    return <PostContex.Provider value={{ reels, posts, addPost, likePost, addComment,loading, addLoading,fetchPost,deletePost }}>{children}</PostContex.Provider>
}

export const PostData = () => useContext(PostContex)