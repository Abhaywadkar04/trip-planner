import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { GetplaceDetails } from "../../service/Global";
import { PHOTO_REF_URL } from "../../service/Global";

function UserTripCardItems({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    trip && getPlacePhoto();
  }, [trip]);

  const getPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location,
    };
    try {
      const resp = await GetplaceDetails(data);
      const photoName = resp.data.places?.[0]?.photos?.[0]?.name;
      if (!photoName) {
        console.warn("No photo found for this place.");
        return null;
      }
      const photoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
      setPhotoUrl(photoUrl);
      return photoUrl;
    } catch (err) {
      console.error("Error fetching place photo:", err);
      return null;
    }
  };

  // Helper function to safely render location
  const getLocationString = (location) => {
    if (!location) return "Unknown Location";

    // If location is a string, return it directly
    if (typeof location === "string") {
      return location;
    }

    // If location is an object, extract the label or value
    if (typeof location === "object") {
      return (
        location.label || location.value || location.name || "Unknown Location"
      );
    }

    return "Unknown Location";
  };

  return (
    <Link
      to={`/view-trip/${trip.id}`}
      className="no-underline block transform hover:scale-105 transition-all duration-300 h-full"
    >
      <div className="border rounded-xl p-4 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer bg-white h-full flex flex-col">
        <div className="overflow-hidden rounded-xl mb-4">
          <img
            src={photoUrl || "/placeholder.jpg"}
            alt="Trip Placeholder"
            className="h-[200px] w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>

        {/* Content container with flex-grow to fill remaining space */}
        <div className="flex flex-col flex-grow">
          <h2 className="text-xl font-bold mb-2 text-gray-800 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {getLocationString(trip?.userSelection?.location)}
          </h2>

          {/* Trip info section */}
          <div className="flex-grow">
            {trip?.userSelection?.travelers && (
              <p className="text-gray-600 mb-1 text-sm">
                👥 {trip.userSelection.travelers}{" "}
                {trip.userSelection.travelers === 1 ? "Traveler" : "Travelers"}
              </p>
            )}

            {trip?.userSelection?.budget && (
              <p className="text-gray-600 mb-1 text-sm">
                💰 Budget: {trip.userSelection.budget}
              </p>
            )}
          </div>

          {/* View Details - Always at bottom */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <p className="text-blue-500 text-sm font-medium hover:text-blue-700 transition-colors duration-200">
              View Trip Details →
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItems;
