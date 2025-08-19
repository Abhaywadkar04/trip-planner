import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../service/Firebaseconfig";
import InfoSection from "./components/InfoSection";
import Hotels from "./components/Hotels";
import PlacesToVisit from "./components/PlacesToVisit";
import Footer from "./components/Footer";
import WeatherDashboard from "./components/ WeatherDashboard";

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    const docRef = doc(db, "AiTrips", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  // Extract location from trip data for weather component
  const getLocationForWeather = () => {
    if (!trip || !trip.userSelection) return null;
    
    // Debug: Log the trip data to see the structure
    console.log('Trip data for weather:', trip);
    console.log('User selection:', trip.userSelection);
    
    // Try different possible location field names from your trip data
    const location = trip?.userSelection?.location?.label || 
                    trip?.userSelection?.location || 
                    trip?.userSelection?.destination ||
                    trip?.destination || 
                    trip?.location ||
                    null;
    
    console.log('Extracted location for weather:', location);
    return location;
  };

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56 2xl:px-80">
      {/* Trip Information */}
      <InfoSection trip={trip} />
      
      {/* Weather Section - Only show if we have location data */}
      {getLocationForWeather() && (
        <div className="mb-8">
          <WeatherDashboard 
            location={getLocationForWeather()}
            showRecommendations={true}
            className="shadow-lg"
          />
        </div>
      )}
      
      {/* Hotels Section */}
      <Hotels trip={trip} />
      
      {/* Places to Visit */}
      <PlacesToVisit trip={trip} />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Viewtrip;