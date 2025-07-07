import React from 'react'
import { Button } from "@/components/ui/button";
import { BsFillSendFill } from "react-icons/bs";
function InfoSection({ trip }) {
  return (
    <div>

        <img src='/placeholder.jpg' alt='Trip Placeholder' className='h-[340px] w-full object-cover rounded-xl'></img>



        <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelection?.location}</h2>
          <div className='flex  gap-2'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500  md:text-md'>📅 {trip?.userSelection?.tripDurationDays}  Day</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500  md:text-md'>💰{trip?.userSelection?.budget}  Budget </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500  md:text-md'>🥂 No. of travelers:{trip?.userSelection?.travelers}  people</h2>
          </div>
        </div>
        <Button><BsFillSendFill /></Button>
        </div>
    </div>
  )
}

export default InfoSection