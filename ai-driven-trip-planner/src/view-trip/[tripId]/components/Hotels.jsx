import React from 'react'
import { Link } from 'react-router-dom';
import HotelCardItem from './HotelCardItem';
function Hotels({ trip }) {
  return (
    <div>
        <h2 className='font-bold text-xl ml-5'>Hotel Recommendation</h2>
   
   
   <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5'>
    {trip?.tripData?.hotelOptions?.map((item,index)=>(
      <HotelCardItem key={index} item={item} />



    ))}
   </div>
   
   
   
   
   
    </div>
  )
}

export default Hotels