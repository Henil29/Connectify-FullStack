import React from 'react'
import AddPost from '../components/AddPost'
import PostCard from '../components/PostCard'
import { PostData } from '../context/PostContex'

const Home = () => {
  const { posts } = PostData()
  return (
    <>
      <AddPost type="post" />
      {posts && posts.length > 0 ?
        posts.map((e) => (<PostCard value={e} key={e._id} type={"post"} />)
        ) : (
          <p>no post yet</p>
          )}

    </>
  )
}

export default Home