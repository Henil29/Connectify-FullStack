import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext()
export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState([])
    const [isAuth, setIsAuth] = useState(false)
    const [loading, setLoading] = useState(true)


    async function registerUser(formdata, navigate,fetchPost) {
        setLoading(true)
        try {
            const { data } = await axios.post('/api/auth/register', formdata);

            toast.success(data.message)
            setIsAuth(true);
            setUser(data.user);
            navigate('/')
            setLoading(false)
            fetchPost()
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false)
        }
    }

    async function loginUser(email, password, navigate,fetchPost) {
        setLoading(true)
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });

            toast.success(data.message)
            setIsAuth(true);
            setUser(data.user);
            navigate('/')
            setLoading(false)
            fetchPost()

        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false)

        }
    }

    async function fetchUser() {
        try {
            const { data } = await axios.get('/api/user/me')
            setUser(data)
            setIsAuth(true)
            setLoading(false)

        } catch (error) {
            // console.log(error)
            setIsAuth(false)
            setLoading(false)
        }
    }

    async function logoutUser(navigate) {
        try {
            const { data } = await axios.get('/api/auth/logout')

            if (data.message) {
                toast.success(data.message)
                setIsAuth(false)
                setUser([])
                navigate('/login')
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    async function followUser(id,fetchUser) {
        try {
            const { data } = await axios.post("/api/user/follow/" + id)
            toast.success(data.message)
            fetchUser();

        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    useEffect(() => {
        fetchUser()
    }, [])
    return (
        <UserContext.Provider value={{ loginUser, isAuth, setIsAuth, user, setUser, loading, logoutUser, registerUser, followUser }}>
            {children}
            <Toaster />
        </UserContext.Provider>
    )

}
export const UserData = () => useContext(UserContext);
