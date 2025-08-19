import React from "react";
import { Link } from "react-router-dom";
import HotelCardItem from "./HotelCardItem";

function Hotels({ trip }) {
  return (
    <div className="px-5 py-5">
      <h2 className="font-bold text-xl mb-5">Hotel Recommendation</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {trip?.tripData?.hotelOptions?.map((item, index) => (
          <HotelCardItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;