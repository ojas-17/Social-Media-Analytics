import React from 'react'
import { useThemeContext } from '../contexts/themeContext'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function PostCard({ post }) {
    const { theme } = useThemeContext()
    return (
        <div className={`w-[300px] flex flex-col rounded-xl border-4 transition-transform duration-200 hover:scale-105 ${theme === 'light' ? 'border-green-400 bg-neutral-300' : 'border-green-600 bg-neutral-900'}`}>
            <Link className={`w-full`} to={`/posts/${post.id}`}>
                <img className='object-cover rounded-t-xl aspect-[4/3]' src={post?.media_url} alt="" />
            </Link>
            <Link to={`/posts/${post.id}`} className='w-full p-2 text-lg'>
                {post?.caption}
            </Link>
            <div className='w-full flex p-2'>
                <a href={post?.permalink} target="_blank" className='w-full flex justify-between items-center mt-2 py-2 px-4 text-white font-semibold text-lg rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 hover:from-purple-700 hover:via-pink-600 hover:to-yellow-500 transition-all duration-300'>
                    <div className='flex items-center gap-3'>
                        <FontAwesomeIcon icon={faInstagram} size='2x'/>
                        <span>Visit Post</span>
                    </div>
                    <FontAwesomeIcon className='w-[30px] h-[30px]' icon={faArrowUpRightFromSquare}/>
                </a>
            </div>
        </div>
    )
}

export default PostCard
