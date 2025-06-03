import React from 'react'
import AddPost from '../components/AddPost'
import PostCard from '../components/PostCard'
import { PostData } from '../context/PostContex'
import { Loading } from '../components/Loading'

const Home = () => {
  const { posts, loading } = PostData()

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <AddPost type="post" />
      {posts && posts.length > 0 ? (
        posts.map((e) => (
          <PostCard value={e} key={e._id} type="post" />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">No posts yet.</p>
      )}
    </>
  )
}

export default Home
