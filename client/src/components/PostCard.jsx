import React from 'react'
import { useThemeContext } from '../contexts/themeContext'
import { Link } from 'react-router-dom'

function PostCard({post}) {
    const { theme } = useThemeContext()
    return (
        <Link className={`w-[23%] rounded-xl ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`} to={`/posts/${post.id}`}>
            <img className='object-cover rounded-xl aspect-[4/3]' src={post?.media_url} alt="" />
        </Link>
    )
}

export default PostCard