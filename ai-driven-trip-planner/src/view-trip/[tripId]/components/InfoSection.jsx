import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BsFillSendFill } from "react-icons/bs";
import { GetplaceDetails } from "../../../service/Global";

const PHOTO_REF_URL = `https://places.googleapis.com/v1/{NAME}/media?key=${
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY
}&maxWidthPx=800`;

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    trip && getPlacePhoto();
  }, [trip]);

  const getPlacePhoto = async () => {
    setIsLoading(true);
    const data = {
      textQuery: trip?.userSelection?.location,
    };
    
    try {
      const resp = await GetplaceDetails(data);
      const photoName = resp.data.places?.[0]?.photos?.[0]?.name;
      
      if (!photoName) {
        console.warn("No photo found for this place.");
        setIsLoading(false);
        return null;
      }
      
      const photoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
      setPhotoUrl(photoUrl);
      setIsLoading(false);
      return photoUrl;
    } catch (err) {
      console.error("Error fetching place photo:", err);
      setIsLoading(false);
      return null;
    }
  };

  // Helper function to safely render location
  const getLocationString = (location) => {
    if (!location) return 'Unknown Location';
    
    if (typeof location === 'string') {
      return location;
    }
    
    if (typeof location === 'object') {
      return location.label || location.value || location.name || 'Unknown Location';
    }
    
    return 'Unknown Location';
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Image Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
          {isLoading ? (
            <div className="h-[400px] w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-500 text-lg">Loading destination image...</div>
            </div>
          ) : (
            <img
              src={photoUrl || "/placeholder.jpg"}
              alt="Trip Destination"
              className="h-[400px] w-full object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Location Badge */}
          <div className="absolute bottom-6 left-6">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                🌍 <span>{getLocationString(trip?.userSelection?.location)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Trip Information Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-orange-500 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Your Dream Trip to {getLocationString(trip?.userSelection?.location)}
            </h1>
            <p className="text-blue-100 text-lg">
              Everything you need to know about your upcoming adventure
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              {/* Trip Details */}
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Trip Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Duration Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white text-lg">📅</span>
                      </div>
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Duration</p>
                        <p className="text-blue-800 font-bold text-lg">
                          {trip?.userSelection?.tripDurationDays || trip?.userSelection?.noOfDays} Days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Budget Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white text-lg">💰</span>
                      </div>
                      <div>
                        <p className="text-green-600 text-sm font-medium">Budget</p>
                        <p className="text-green-800 font-bold text-lg">
                          {trip?.userSelection?.budget}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Travelers Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white text-lg">👥</span>
                      </div>
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Travelers</p>
                        <p className="text-purple-800 font-bold text-lg">
                          {trip?.userSelection?.travelers} {trip?.userSelection?.travelers === 1 ? 'Person' : 'People'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;