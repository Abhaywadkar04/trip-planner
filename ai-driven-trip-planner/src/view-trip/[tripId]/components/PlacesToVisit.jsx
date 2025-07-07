import React from "react";
import PlaceCard from "./PlaceCard";

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-lg">Places to Visit</h2>
      <div className="font-medium text-lg mb-2">
  {Object.entries(trip?.tripData?.itinerary || {}).map(([day, places], index) => (
    <div key={index} className="mb-6"> {/* 🔧 moved grid BELOW this */}
      
      {/* ✅ Heading outside grid */}
      <h2 className="font-bold text-lg mb-2 p-3">{`Day ${day.replace('day', '')}`}</h2> {/* 🔧 day formatting fix */}

      {/* ✅ Grid container only for places */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* 🔧 moved here */}
        {places?.plan?.map((place, idx) => (
          <div key={`${day}-${idx}`} className="p-4 rounded-lg  bg-white"> {/* 🔧 unique key and styling */}

            <h2 className="font-medium text-sm text-orange-600">🕣 {place.bestTimetoVisit || place.time || "unknown" }</h2>
            <div className="my-3">
              <PlaceCard place={place} />
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default PlacesToVisit;
