import React, { useState } from 'react'
import { useUserContext } from '../contexts/userContext'
import { useThemeContext } from '../contexts/themeContext'

function AccountPage() {
    const { user, setUser } = useUserContext()
    const { theme } = useThemeContext()

    const [sidebarOption, setSidebarOption] = useState(1)

    const [fullName, setFullName] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [apiKey, setApiKey] = useState('')

    const [msg, setMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    if (!user?._id) return (
        <div>

        </div>
    )

    const updateUser = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            credentials: 'include'
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/users/current-user`, options)
            .then((res) => res.json())
            // .then((res) => console.log(res.data))
            .then((res) => res?.data ? setUser(res?.data) : setUser({}))
            .catch((err) => console.log(err))
    }

    const updateFullName = async () => {
        const data = {
            fullName
        }
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/users/update-details`
        
        fetch(url, options)
        .then((res) => res.json())
        .then((res) => {
            setMsg('Name Updated Successfully')
            updateUser()
            setFullName('')
            setTimeout(() => {
                setMsg('')
            }, 2000);
        })
        .catch((err) => {
            setErrorMsg('Error updating Name')
            setTimeout(() => {
                setErrorMsg('')
            }, 2000);
            console.log(err)
        })
    }

    const updatePassword = async () => {
        const data = {
            oldPassword,
            newPassword
        }
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/users/update-password`
        
        fetch(url, options)
        .then((res) => {
            if(res.status === 400) {
                setErrorMsg('Invalid Old Password')
                setTimeout(() => {
                    setErrorMsg('')
                }, 2000);
            }

            return res.json()
        })
        .then((res) => {
            setMsg('Password Updated Successfully')
            updateUser()
            setOldPassword('')
            setNewPassword('')
            setTimeout(() => {
                setMsg('')
            }, 2000);
        })
        .catch((err) => {
            setErrorMsg('Error updating Password')
            setTimeout(() => {
                setErrorMsg('')
            }, 2000);
            console.log(err)
        })
    }

    const updateApiKey = async () => {
        const data = {
            apiToken: apiKey
        }
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/users/update-details`
        
        fetch(url, options)
        .then((res) => res.json())
        .then((res) => {
            setMsg('API Key Updated Successfully')
            updateUser()
            setApiKey('')
            setTimeout(() => {
                setMsg('')
            }, 2000);
        })
        .catch((err) => {
            setErrorMsg('Error updating API Key')
            setTimeout(() => {
                setErrorMsg('')
            }, 2000);
            console.log(err)
        })
    }

    return (
        <div className='mt-20 items-center py-10 w-5/6 flex flex-col gap-10'>
            <div className={`fixed top-0 left-1/2 -translate-x-1/2 mt-32 p-3 transition-transform duration-200 ${msg ? '-translate-y-0' : '-translate-y-24' } rounded-full text-lg bg-green-500`}>{msg}</div>
            <div className={`fixed top-0 left-1/2 -translate-x-1/2 mt-32 p-3 transition-transform duration-200 ${errorMsg ? '-translate-y-0' : '-translate-y-24' } rounded-full text-lg bg-red-500`}>{errorMsg}</div>

            <div className={`w-full flex justify-center items-center text-4xl p-5 rounded-3xl ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}>
                {user?.fullName}
            </div>

            <div className={`w-full flex p-10 rounded-3xl ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}>
                <div className='w-1/4 flex flex-col py-10 pr-10 gap-5'>
                    <div
                        className={`p-2 rounded-xl cursor-pointer transition-colors duration-200 ${sidebarOption === 1 ? theme === 'light' ? 'bg-green-400' : 'bg-green-600' : ''}`}
                        onClick={() => setSidebarOption(1)}
                    >
                        Update User Details
                    </div>

                    <div
                        className={`p-2 rounded-xl cursor-pointer transition-colors duration-200 ${sidebarOption === 2 ? theme === 'light' ? 'bg-green-400' : 'bg-green-600' : ''}`}
                        onClick={() => setSidebarOption(2)}
                    >
                        Update API Key
                    </div>
                </div>

                <div className={`h-[65vh] w-px ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>

                {
                    sidebarOption === 1 && (
                        <div className='w-3/4 min-h-96 pl-10 flex flex-col gap-10'>
                            <div className='w-full flex flex-col gap-1 text-lg'>
                                <span className='text-2xl text-center mb-5'>Update Name</span>
                                <label className='px-2' htmlFor="">Enter Full Name</label>
                                <input
                                    className={`rounded-lg p-2 w-2/3 text-xl placeholder-neutral-600 ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'}`}
                                    type="text"
                                    placeholder='Full Name'
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />

                                {
                                    fullName && (
                                        <div className='mt-5 flex justify-center'>
                                            <button
                                            className={`border-2 pb-2 pt-1 px-5 rounded-lg transition-colors duration-200 ${theme === 'light' ? 'border-green-400 hover:bg-green-400' : 'border-green-600 hover:bg-green-600'}`}
                                            onClick={updateFullName}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    )
                                }

                            </div>

                            <div className={`w-full h-px ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>

                            <div className='w-full flex flex-col gap-5 text-lg'>
                                <span className='text-2xl text-center mb-5'>Update Password</span>
                                <div className='flex flex-col gap-1'>
                                    <label className='px-2' htmlFor="">Enter Old Password</label>
                                    <input
                                        className={`rounded-lg p-2 w-2/3 text-xl placeholder-neutral-600 ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'}`}
                                        type="text"
                                        placeholder='Old Password'
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='px-2' htmlFor="">Enter New Password</label>
                                    <input
                                        className={`rounded-lg p-2 w-2/3 text-xl placeholder-neutral-600 ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'}`}
                                        type="text"
                                        placeholder='New Password'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>

                                {
                                    oldPassword && newPassword && (
                                        <div className='mt-5 flex justify-center'>
                                            <button
                                            className={`border-2 pb-2 pt-1 px-5 rounded-lg transition-colors duration-200 ${theme === 'light' ? 'border-green-400 hover:bg-green-400' : 'border-green-600 hover:bg-green-600'}`}
                                            onClick={updatePassword}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    )
                }

                {
                    sidebarOption === 2 && (
                        <div className='w-3/4 min-h-96 pl-10 pt-10 flex flex-col gap-10'>
                            <div className='w-full flex flex-col gap-1 text-lg'>
                                <span className='text-2xl text-center mb-5'>Update API Key</span>
                                <label className='px-2' htmlFor="">Enter API Key</label>
                                <input
                                    className={`rounded-lg p-2 w-2/3 text-xl placeholder-neutral-600 ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'}`}
                                    type="text"
                                    placeholder='API Key'
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />

                                {
                                    apiKey && (
                                        <div className='mt-5 flex justify-center'>
                                            <button
                                            className={`border-2 pb-2 pt-1 px-5 rounded-lg transition-colors duration-200 ${theme === 'light' ? 'border-green-400 hover:bg-green-400' : 'border-green-600 hover:bg-green-600'}`}
                                            onClick={updateApiKey}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default AccountPage