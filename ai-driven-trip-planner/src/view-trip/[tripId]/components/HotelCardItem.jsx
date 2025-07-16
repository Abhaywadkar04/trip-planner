import React from 'react'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GetplaceDetails } from '../../../service/Global';
import { PHOTO_REF_URL } from '../../../service/Global';
function HotelCardItem({ item,index }) {


const [photoUrl, setPhotoUrl] = useState();



  useEffect(() => {
   item &&  getPlacePhoto();
  }, [item]);
const getPlacePhoto = async () => {
  const data = {
    textQuery: item.hotelName
  };

  try {
    const resp = await GetplaceDetails(data);
    const photoName = resp.data.places?.[0]?.photos?.[0]?.name;

    if (!photoName) {
      console.warn("No photo found for this place.");
      return null;
    }

    const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
    console.log("Photo URL:", photoUrl);
    setPhotoUrl(photoUrl);

    return photoUrl;
  } catch (err) {
    console.error("Error fetching place photo:", err);
    return null;
  }
};













  return (
     <Link to={'https://www.google.com/maps/search/?api=1&query='+item.hotelName+","+item.address} target='_blank'>
        <div key={index} className="flex flex-col gap-2 p-4 rounded-lg shadow-md bg-white hover:scale-105 transition-all cursor-pointer">
            <img src={photoUrl} className='rounded-lg h-[180px] w-full object-cover' alt={item.name} />
            <div className="my-2 flex flex-col gap-1">
                <h2 className='font-medium '>{item.hotelName}</h2>
                <h2 className='text-xs text-gray-500 '>📍 {item.address}</h2>
                <h2 className='text-xs '>💰 {item.pricePerNightEstimate}</h2>
                <h2 className='text-xs '>⭐️ {item.rating}</h2>
            </div>
        </div>
        </Link>
  )
}

export default HotelCardItem