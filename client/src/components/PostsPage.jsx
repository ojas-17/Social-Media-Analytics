import React, { useEffect, useState } from 'react'
import PostCard from './PostCard'
import { useUserContext } from '../contexts/userContext'
import { useNavigate } from 'react-router-dom'

function PostsPage() {
    const { user } = useUserContext()
    const [posts, setPosts] = useState([])
    
    useEffect(() => {
        if (user?._id) {
            // console.log(user)
            const url = `https://graph.facebook.com/v20.0/${user?.instagramAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${user?.apiToken}`
            fetch(url)
                .then((res) => res.json())
                .then((res) => setPosts(res.data))
                .catch((err) => console.log(err))
        }
    }, [user])

    return (
        <div className='w-5/6 mt-20 flex flex-col flex-wrap'>
            <div className='w-full flex justify-center text-4xl my-10'>Your Posts</div>

            {
                user?._id && (
                    <div className='flex flex-wrap '>
                    {
                        posts && posts.map((post) => {
                            return (
                                <PostCard post={post} key={post.id} />
                            )
                        })
                    }
                </div>
                )
            }
        </div>
    )
}

export default PostsPage
