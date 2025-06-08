import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Loading } from '../components/Loading'

const Search = () => {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (search.trim()) {
                fetchUsers(search)
            } else {
                setUsers([])
            }
        }, 500) // 500ms debounce

        return () => clearTimeout(delayDebounce)
    }, [search])

    async function fetchUsers(query) {
        setLoading(true)
        try {
            const { data } = await axios.get('/api/user/all?search=' + query)
            setUsers(data)
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">Search Users</h1>

                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
                    placeholder="Enter user name"
                />

                {loading ? (
                    <Loading />
                ) : (
                    <div className="space-y-3">
                        {users && users.length > 0 ? (
                            users.map(user => (
                                <Link
                                    key={user._id}
                                    to={`/user/${user._id}`}
                                    className="flex items-center gap-4 p-3 border border-gray-200 rounded-md hover:bg-gray-100 transition"
                                >
                                    <img
                                        src={user.profilePic.url}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <span className="text-gray-700 font-medium">{user.name}</span>
                                </Link>
                            ))
                        ) : (
                            search && <p className="text-center text-gray-500">No user found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Search
