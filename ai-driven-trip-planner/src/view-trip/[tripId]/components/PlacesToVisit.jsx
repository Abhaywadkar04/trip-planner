import React from "react";
import PlaceCard from "./PlaceCard";

// function PlacesToVisit({ trip }) {
//   const bestTime = trip?.tripData?.bestTimeToVisit || "Unknown";

//   return (
//     <div>
//       <h2 className="font-bold text-lg">Places to Visit</h2>
//       <div className="font-medium text-lg mb-2">
//         {Object.entries(trip?.tripData?.itinerary || {}).map(
//           ([day, places], index) => (
//             <div key={index} className="mb-6">
//               <h2 className="font-bold text-lg mb-2 p-3">
//                 {`Day ${day.replace("day", "")}`}
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {places.map((place, idx) => (
//                   <div
//                     key={`${day}-${idx}`}
//                     className="p-4 rounded-lg bg-white"
//                   >
//                     {/* ✅ Display best time to visit here */}
//                     <h2 className="font-medium text-sm text-orange-600">
//                       🕣 Best Time to Visit: {place.bestTimetoVisit || bestTime}
//                     </h2>

//                     <div className="my-3">
//                       <PlaceCard place={place} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// }

// function PlacesToVisit({ trip }) {
//   const bestTime = trip?.tripData?.bestTimeToVisit || "Unknown";

//   return (
//     <div>
//       <h2 className="font-bold text-lg">Places to Visit</h2>
//       <div className="font-medium text-lg mb-2">
//         {Object.entries(trip?.tripData?.itinerary || {}).map(
//           ([day, dayData], index) => (
//             <div key={index} className="mb-6">
//               <h2 className="font-bold text-lg mb-2 p-3">
//                 {`Day ${day.replace("day", "")}`}
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {(dayData.plan || []).map((place, idx) => (
//                   <div
//                     key={`${day}-${idx}`}
//                     className="p-4 rounded-lg bg-white"
//                   >
//                     {/* ✅ Display best time to visit here */}
//                     <h2 className="font-medium text-sm text-orange-600">
//                       🕣 Best Time to Visit: {place.bestTimetoVisit || bestTime}
//                     </h2>

//                     <div className="my-3">
//                       <PlaceCard place={place} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// }



function PlacesToVisit({ trip }) {
  const bestTime = trip?.tripData?.bestTimeToVisit || "Unknown";

  return (
    <div>
      <h2 className="font-bold text-lg">Places to Visit</h2>
      <div className="font-medium text-lg mb-2">
        {Object.entries(trip?.tripData?.itinerary || {}).map(([day, dayData], index) => {
          // Handle both possible formats
          const places = Array.isArray(dayData)
            ? dayData
            : Array.isArray(dayData?.plan)
            ? dayData.plan
            : [];

          return (
            <div key={index} className="mb-6">
              <h2 className="font-bold text-lg mb-2 p-3">
                {`Day ${day.replace("day", "")}`}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {places.map((place, idx) => (
                  <div key={`${day}-${idx}`} className="p-4 rounded-lg bg-white">
                    <h2 className="font-medium text-sm text-orange-600">
                      🕣 Best Time to Visit: {place.bestTimetoVisit || bestTime}
                    </h2>
                    <div className="my-3">
                      <PlaceCard place={place} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



export default PlacesToVisit;
