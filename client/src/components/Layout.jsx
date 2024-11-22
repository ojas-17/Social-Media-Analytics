import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import { useThemeContext } from '../contexts/themeContext'

function Layout() {
    const { theme } = useThemeContext()

    return (
        <div className={`flex flex-col w-full min-h-screen transition-colors duration-200 ${theme === 'light' ? 'bg-neutral-100 text-black' : 'bg-neutral-800 text-white'} text-2xl items-center`}>
            <Header />
            <Outlet />
        </div>
    )
}

export default Layout