import React, { useEffect } from "react";
import { useNavigation } from "react-router-dom";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../service/Firebaseconfig";
import { useState } from "react";
import UserTripCardItems from "./components/UserTripCardItems";

const MyTrip = () => {
  useEffect(() => {
    getUserTrip();
  }, []);

  const navigation = useNavigation();
  const [userTrips, setUserTrips] = useState([]);

  const getUserTrip = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigation("/");
      return;
    }

    const q = query(
      collection(db, "AiTrips"),
      where("userEmail", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);
    setUserTrips([]);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUserTrips((prev) => [...prev, { ...doc.data(), id: doc.id }]);
    });
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="text-3xl font-bold">my trips</h2>

      <div className="grid grid-cols-2  md:grid-cols-3 gap-5 mt-10">
        {userTrips.map((trip, index) => {
          return <UserTripCardItems trip={trip} key={index} />;
        })}
      </div>
    </div>
  );
};

export default MyTrip;
