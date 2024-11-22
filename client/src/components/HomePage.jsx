import React, { useState } from 'react'
import bgImg from '../assets/bg_image.png'
import { useThemeContext } from '../contexts/themeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'
import postsImg from '../assets/posts.png'
import insightsImg from '../assets/insights.png'
import sentimentImg from '../assets/sentiment.png'


function HomePage() {
  const { theme } = useThemeContext()
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <div className='w-full flex flex-col pt-20'>
      <div className='w-full h-screen relative text-white bg-[url("https://memberpress.com/wp-content/uploads/2019/10/Choosing-platforms@2x.png")] bg-cover'>
        <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-70'></div>
        <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center pt-10 gap-20 '>
          <h1 className='text-4xl'>Social Media Analytics</h1>
          <div className='text-8xl h-60 flex items-center text-center text-balance leading-relaxed '>Analyze Insights from your Social Media Accounts</div>
          <button
            className={`py-3 px-6 border-2 flex gap-3 items-center rounded-full transition-colors duration-200 ${theme === 'light' ? 'border-green-500 hover:bg-green-500' : 'border-green-600 hover:bg-green-600'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate('/signup')}
          >
            <span className='pb-1'>Get Started</span>
            <FontAwesomeIcon icon={faArrowRight} className={`transition-transform duration-300 ${isHovered ? 'transform translate-x-3' : ''}`} />
          </button>
        </div>
      </div>

      <div className='w-full h-screen flex relative overflow-hidden'>
        {/* <div className='absolute top-0 left-0 w-full h-full opacity-30 bg-center -rotate-[30deg] scale-[1.8] bg-repeat bg-[size:20%] bg-[url("https://thumbs.wbm.im/pw/medium/3022aef839146ba6e87b8487bc6ab00e.png")]'></div> */}
        <div className='absolute top-0 flex left-0 w-full h-full'>
          <div className='w-1/2 h-full flex justify-center items-center'>
            <div className='w-2/3 h-2/3'>
              <img className='w-full h-full' src={postsImg} alt="" />
            </div>
          </div>
          <div className='w-1/2 h-full flex justify-center items-center'>
            <div className={`text-5xl w-2/3 aspect-video text-center rounded-full py-10 px-5 flex justify-center items-center ${theme === 'light' ? 'bg-green-400' : 'bg-green-600'}`}>
              View all posts from your Social Media Accounts
            </div>
          </div>
        </div>
      </div>

      <div className='w-full h-screen flex relative overflow-hidden'>
        {/* <div className='absolute top-0 left-0 w-full h-full opacity-30 bg-center -rotate-[30deg] scale-[1.8] bg-repeat bg-[size:20%] bg-[url("https://thumbs.wbm.im/pw/medium/3022aef839146ba6e87b8487bc6ab00e.png")]'></div> */}
        <div className='absolute top-0 flex left-0 w-full h-full'>
          <div className='w-1/2 h-full flex justify-center items-center'>
            <div className={`text-5xl w-2/3 aspect-video text-center rounded-full py-10 px-5 flex justify-center items-center ${theme === 'light' ? 'bg-green-400' : 'bg-green-600'}`}>
              Gain Insights from your posts
            </div>
          </div>

          <div className='w-1/2 h-full flex justify-center items-center'>
            <div className='w-2/3 h-1/2'>
              <img className='w-full h-full' src={insightsImg} alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className='w-full h-screen flex relative overflow-hidden'>
        {/* <div className='absolute top-0 left-0 w-full h-full opacity-30 bg-center -rotate-[30deg] scale-[1.8] bg-repeat bg-[size:20%] bg-[url("https://thumbs.wbm.im/pw/medium/3022aef839146ba6e87b8487bc6ab00e.png")]'></div> */}
        <div className='absolute top-0 flex left-0 w-full h-full'>
          <div className='w-2/3 h-full flex justify-center items-center'>
            <div className='w-5/6 h-1/2'>
              <img className='w-full h-full' src={sentimentImg} alt="" />
            </div>
          </div>
          <div className='w-1/3 h-full flex justify-center items-center'>
            <div className={`text-4xl w-5/6 aspect-video text-center rounded-full py-10 px-5 flex justify-center items-center ${theme === 'light' ? 'bg-green-400' : 'bg-green-600'}`}>
              Analyze Public opinion and user engagement
            </div>
          </div>
        </div>
      </div>

      {/* <div className='w-full h-screen flex bg-blue-300'>

      </div> */}
    </div>
  )
}

export default HomePage