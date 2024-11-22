import React, { useState } from 'react'
import { useThemeContext } from '../contexts/themeContext'
import { useUserContext } from '../contexts/userContext'
import logo from '../assets/logo2.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faMoon, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { MdSunny } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';


function Header() {
    const { theme, setTheme } = useThemeContext()
    const { user, setUser } = useUserContext()
    const [accountPopUp, setAccountPopUp] = useState(false)

    const navigate = useNavigate()

    const logoutUser = async () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            credentials: 'include'
        }
        const url = `${import.meta.env.VITE_BACKEND_URL}/users/logout`

        fetch(url, options)
            .then((res) => res.json())
            .then((res) => {
                setUser({})
                navigate('/')
                setAccountPopUp(false)
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className={`w-full z-10 fixed left-0 top-0 h-20 p-5 flex justify-between items-center transition-colors duration-200 ${theme === 'light' ? 'bg-green-400' : 'bg-green-600'}`}>
            {
                accountPopUp && (
                    <div className='fixed top-0 left-0'>
                        <div className='fixed top-0 left-0 w-full h-screen' onClick={() => setAccountPopUp(false)}></div>
                        <div className={`fixed right-5 top-24 w-1/5 rounded-2xl py-3 px-5 ${theme === 'light' ? 'bg-green-400' : 'bg-green-600'}`}>
                            <div className={`p-5 flex gap-3 items-center cursor-pointer rounded-xl ${theme === 'light' ? 'hover:bg-green-300' : 'hover:bg-green-700'} `} onClick={() => {
                            navigate('/account')
                            setAccountPopUp(false)
                            }}>
                                <FontAwesomeIcon className='aspect-square w-[32px]' icon={faUser} />
                                <span>Account</span>
                            </div>

                            <div className={`p-5 flex gap-3 items-center cursor-pointer rounded-xl ${theme === 'light' ? 'hover:bg-green-300' : 'hover:bg-green-700'} `} onClick={logoutUser}>
                                <FontAwesomeIcon className='aspect-square w-[32px]' icon={faRightFromBracket} />
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>
                )
            }

            <Link to='/dashboard' className=''>
                <img className='aspect-auto h-20' src={logo} alt="" />
            </Link>
            <div className='flex gap-5 h-full items-center'>
                <div className=' cursor-pointer' onClick={() => setTheme((prev) => prev === 'light' ? 'dark' : 'light')}>
                    {
                        theme === 'dark' ? (
                            <FontAwesomeIcon
                                className={`aspect-[1/1] text-3xl`}
                                icon={faMoon}
                            />
                        ) : (
                            <MdSunny
                                className={`text-4xl`}
                            />
                        )
                    }
                </div>

                {
                    user?._id && (
                        <div className='px-5 cursor-pointer' onClick={() => setAccountPopUp(true)}>
                            <FontAwesomeIcon className='aspect-square w-[32px]' icon={faUser} />
                        </div>
                    )
                }

                {
                    !user?._id && (
                        <Link to='/login'>
                            <button
                            className={`border-2 pb-2 pt-1 px-5 rounded-lg transition-colors duration-200 ${theme === 'light' ? 'border-neutral-800' : 'border-neutral-200'}`}
                            >
                                Login
                            </button>
                        </Link>
                    )
                }
            </div>
        </div>
    )
}

export default Header