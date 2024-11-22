import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/userContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';

function DashboardPage() {
    const { user, setUser } = useUserContext()
    const navigate = useNavigate()

    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        credentials: 'include'
      }
    
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/users/refresh-token`, options)
        .then((res) => res.json())
        // .then((res) => console.log(res))
        .catch((err) => console.log(err))
        
        fetch(`${import.meta.env.VITE_BACKEND_URL}/users/current-user`, options)
        .then((res) => res.json())
        // .then((res) => console.log(res.data))
        .then((res) => res?.data ? setUser(res?.data) : navigate('/'))
        .catch((err) => {
            console.log(err)
            navigate('/')
        })
      }, [])

    return (
        <div className='mt-20 pt-10 flex flex-col gap-10  w-5/6'>
            <h1 className='text-4xl text-center'>Dashboard</h1>

            {
                user?._id && (
                    <div className='w-full h-[60vh] flex justify-between text-black'>
                        <Link to='/posts' className='w-[49%] h-full flex flex-col justify-center items-center gap-5 text-6xl rounded-3xl border-4 border-green-600 bg-green-200 hover:bg-green-600 transition-colors duration-200 cursor-pointer'>
                            <span>View Posts</span>
                            <FontAwesomeIcon icon={faImage} />
                        </Link>

                        <Link to='/account' className='w-[49%] h-full rounded-3xl text-6xl border-4 border-green-600 bg-green-200 hover:bg-green-600 transition-colors duration-200 cursor-pointer'>
                            {
                                user?.apiToken ? (
                                    <div className='w-full h-full flex flex-col justify-center items-center gap-5 '>
                                        <span>Change API Key</span>
                                        <FontAwesomeIcon icon={faFacebookSquare} />
                                    </div>
                                ) : (
                                    <div className='w-full h-full flex flex-col justify-center items-center gap-5 '>
                                        <span>Add API Key</span>
                                        <FontAwesomeIcon icon={faFacebookSquare} />
                                    </div>
                                )
                            }
                        </Link>

                    </div>
                )
            }
        </div>
    )
}

export default DashboardPage