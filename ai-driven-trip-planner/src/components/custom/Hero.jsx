import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center max-w-4xl mx-auto px-4 gap-9'>
      <h1 className='font-extrabold text-[60px] text-center mt-16'>
        <span className='text-[#f56551]'>Discover the next adventure using AI: </span>
        Plan your trip with ease
      </h1>

      <p className='text-xl text-gray-500 text-center'>
        Get personal recommendations for your trip, including destinations, activities, and more.
        No more endless scrolling or searching — just a seamless experience.
      </p>
      <Link to={"/create-trip"}>
      <Button>Get Started, it's free</Button>
      </Link>
    </div>
  )
}

export default Hero
