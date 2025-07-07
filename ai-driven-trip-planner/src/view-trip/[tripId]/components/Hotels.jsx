import React from 'react'
import { Link } from 'react-router-dom';

function Hotels({ trip }) {
  return (
    <div>
        <h2 className='font-bold text-xl ml-5'>Hotel Recommendation</h2>
   
   
   <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5'>
    {trip?.tripData?.hotelOptions?.map((item,index)=>(
        <Link to={'https://www.google.com/maps/search/?api=1&query='+item.hotelName+","+item.address} target='_blank'>
        <div key={index} className="flex flex-col gap-2 p-4 rounded-lg shadow-md bg-white hover:scale-105 transition-all cursor-pointer">
            <img src="/placeholder.jpg" className='rounded-lg' alt={item.name} />
            <div className="my-2 flex flex-col gap-1">
                <h2 className='font-medium '>{item.hotelName}</h2>
                <h2 className='text-xs text-gray-500 '>📍 {item.address}</h2>
                <h2 className='text-xs '>💰 {item.pricePerNightEstimate}</h2>
                <h2 className='text-xs '>⭐️ {item.rating}</h2>
            </div>
        </div>
        </Link>



    ))}
   </div>
   
   
   
   
   
    </div>
  )
}

export default Hotels