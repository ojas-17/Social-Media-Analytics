import React, { useEffect, useState } from 'react'
import bgImg from '../assets/bg_image.png'
import { useThemeContext } from '../contexts/themeContext'
import { useUserContext } from '../contexts/userContext'
import { Link, useNavigate } from 'react-router-dom'


function LoginPage() {
    const navigate = useNavigate()

    const { theme } = useThemeContext()
    const { user, setUser } = useUserContext()

    useEffect(() => {
        if(user?._id) {
            navigate('/dashboard')
        }
    }, [user])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) {
            setError("Email is required")
            setTimeout(() => {
                setError('')
            }, 3000);
        }
        else if (!password) {
            setError("Password is required")
            setTimeout(() => {
                setError('')
            }, 3000);
        }
        else {
            const url = `${import.meta.env.VITE_BACKEND_URL}/users/login`
            const data = {
                email,
                password
            }
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                },
                body: JSON.stringify(data),
                credentials: 'include'
            }

            fetch(url, options)
                .then((res) => {
                    if (res.status === 404) {
                        setError("Email not found")
                        setTimeout(() => {
                            setError('')
                        }, 3000);
                    }
                    else if (res.status === 401) {
                        setError("Incorrect Password")
                        setTimeout(() => {
                            setError('')
                        }, 3000);
                    }
                    return res.json()
                })
                .then((res) => {
                    setUser(res.data)
                    navigate("/dashboard")
                })
                .catch((err) => console.log(err))
        }

    }

    return (
        <div className='w-full h-screen flex pt-20'>
            <div className='w-1/2 flex flex-col items-center gap-5'>
                <h1 className='mt-14 text-4xl'>Login</h1>

                <div className='w-1/2 flex justify-center items-center h-10'>
                    {
                        error && (
                            <div className={`w-full flex justify-center text-lg ${theme === 'light' ? 'bg-red-400' : 'bg-red-600'} p-1 rounded-md`}>
                                {error}
                            </div>
                        )
                    }
                </div>
                <form className='w-1/2 flex flex-col items-center gap-8' onSubmit={handleSubmit}>

                    <div className='w-full flex flex-col gap-2'>
                        <label className='text-lg' htmlFor="">Enter Email</label>
                        <input
                            className={`rounded-lg p-2 text-xl ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}
                            type="text"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='w-full flex flex-col gap-2'>
                        <label className='text-lg' htmlFor="">Enter Password</label>
                        <input
                            className={`rounded-lg p-2 text-xl ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}
                            type="text"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                    className={`border-2 pb-2 pt-1 px-5 rounded-lg transition-colors duration-200 ${theme === 'light' ? 'border-green-400 hover:bg-green-400' : 'border-green-600 hover:bg-green-600'}`}
                    >
                        Login
                    </button>

                </form>

                <span className='text-lg'>Don't have an account? <Link to='/signup' className={`underline ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>Register Here</Link></span>
            </div>
            <div className={`w-1/2 relative overflow-hidden transition-colors duration-200 ${theme === 'light' ? 'bg-green-400' : 'bg-green-600'}`}>
                <div className="absolute inset-0 bg-[url('./assets/bg_image.png')] bg-center bg-repeat bg-[size:33%] scale-[1.4] rotate-[30deg]"></div>
                {/* <img className='h-full scale-50 rotate-45 bg-contain ' src={bgImg} alt="" /> */}
            </div>
        </div>
    )
}

export default LoginPage