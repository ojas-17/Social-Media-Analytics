// import './App.css'
import { ThemeProvider } from './contexts/themeContext.js'
import { UserProvider } from './contexts/userContext.js'
import InsightsPage from './components/InsightsPage';
import { useEffect, useState } from 'react';
import Layout from './components/Layout.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import PostsPage from './components/PostsPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import DashboardPage from './components/DashboardPage.jsx';
import AccountPage from './components/AccountPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'signup',
        element: <SignUpPage/>
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'account',
        element: <AccountPage />
      },
      {
        path: 'posts',
        children: [
          {
            path: '',
            element: <PostsPage />
          },
          {
            path: ':mediaId',
            element: <InsightsPage />
          }
        ]
      }
    ]
  }
])

function App() {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState({})

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
    .then((res) => res?.data ? setUser(res?.data) : setUser({}))
    .catch((err) => console.log(err))

  }, [])

  return (
    <ThemeProvider value={{ theme, setTheme }}>
      <UserProvider value={{ user, setUser }}>
        <RouterProvider router={router} />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;

