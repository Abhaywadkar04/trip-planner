import React, { use } from 'react'
import { Button } from "@/components/ui/button";
import { BsFillSendFill } from "react-icons/bs";
import { GetplaceDetails } from '../../../service/Global';
import { useEffect } from 'react';
import { useState } from 'react';



const PHOTO_REF_URL = `https://places.googleapis.com/v1/{NAME}/media?key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}&maxWidthPx=800`;
function InfoSection({ trip }) {

const [photoUrl, setPhotoUrl] = useState();



  useEffect(() => {
   trip &&  getPlacePhoto();
  }, [trip]);
const getPlacePhoto = async () => {
  const data = {
    textQuery: trip?.userSelection?.location
  };

  try {
    const resp = await GetplaceDetails(data);
    const photoName = resp.data.places?.[0]?.photos?.[0]?.name;

    if (!photoName) {
      console.warn("No photo found for this place.");
      return null;
    }

    const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
    setPhotoUrl(photoUrl);

    return photoUrl;
  } catch (err) {
    console.error("Error fetching place photo:", err);
    return null;
  }
};

  return (
    <div>

        <img src={photoUrl} alt='Trip Placeholder' className='h-[340px] w-full object-cover rounded-xl'></img>



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