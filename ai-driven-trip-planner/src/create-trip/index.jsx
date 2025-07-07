import React, { useState, useEffect, use } from "react";
import GooglePlaceAutoComplete from "react-google-autocomplete";
import { Input } from "../components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelsList,
} from "../constants/options";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { chatSession } from "../service/AIModel";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import TripOutput from "./trip-out";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/Firebaseconfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedTravellers, setSelectedTravellers] = useState(null);
  const [tripResult, setTripResult] = useState(""); // ✅ result display
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Optional: fix Google Maps LatLng if present in formData

  const OnGenerateTrips = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      formData?.noOfDays > 5 &&
      (!formData.location || !formData.budget || !formData.travellers)
    ) {
      toast("Please fill all the fields");
      return;
    }
    setIsLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.formatted_address
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{travelers}", formData?.travellers)
      .replace("{budget}", formData?.budget);

    console.log("Generated Prompt:", FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT); // ✅ fixed
      const response = await result.response.text();
      setTripResult(response); // ✅ store in state to display
      console.log("AI Response:", response);

      SaveAiTrip(response);
    } catch (err) {
      toast.error("Something went wrong with AI response");
      console.error(err);
    }
    setIsLoading(false);
  };

  // const SaveAiTrip = async (TripData) => {
  //   setIsLoading(true);
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   const docId = Date.now().toString(); // Generate a unique ID based on timestamp
  //   await setDoc(doc(db, "AiTrips", docId), {
  //     userSelection: formData,
  //     tripData: JSON.parse(TripData),
  //     userEmail: user?.email,
  //     id: docId, // Add the unique ID to the document
  //   });
  //   setIsLoading(false);
  // };

  // const SaveAiTrip = async (TripData, formData, setIsLoading) => {
  //   try {
  //     setIsLoading(true);
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     const docId = Date.now().toString();

  //     let cleanedFormData;
  //     try {
  //       cleanedFormData = structuredClone(formData);
  //     } catch {
  //       cleanedFormData = JSON.parse(JSON.stringify(formData));
  //     }

  //     const loc = cleanedFormData?.location?.geometry?.location;
  //     if (
  //       loc &&
  //       typeof loc.lat === "function" &&
  //       typeof loc.lng === "function"
  //     ) {
  //       cleanedFormData.location.geometry.location = sanitizeLatLng(loc);
  //     }

  //     console.log("Data being saved:", JSON.stringify(TripData, null, 2));
  //     console.log(
  //       "Type of data fields:",
  //       Object.entries(TripData).map(([k, v]) => [k, typeof v])
  //     );

  //     await setDoc(doc(db, "AiTrips", docId), {
  //       userSelection: cleanedFormData,
  //       tripData: TripData,
  //       userEmail: user?.email || "guest@demo.com",
  //       id: docId,
  //     });

  //     toast.success("✅ Trip saved successfully!");
  //   } catch (err) {
  //     console.error("🔥 Firestore write failed:", err.message, err);
  //     toast.error("❌ Failed to save trip.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const SaveAiTrip = async (TripData) => {
  //   setIsLoading(true);
  //   try {
  //     console.log("Original TripData:", TripData);
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     const docId = Date.now().toString();

  //     let cleanedTripData = TripData;

  //     // Remove markdown code blocks from beginning and end
  //     cleanedTripData = cleanedTripData.replace(/^```json\s*/g, '');
  //     cleanedTripData = cleanedTripData.replace(/```.*$/g, ''); // Remove ``` and everything after it

  //     // Remove JavaScript-style comments
  //     cleanedTripData = cleanedTripData.replace(/\/\/.*$/gm, '');

  //     // Remove trailing commas
  //     cleanedTripData = cleanedTripData.replace(/,(\s*[}\]])/g, '$1');

  //     // Remove control characters
  //     cleanedTripData = cleanedTripData.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  //     // Fix incomplete URLs - this is the main issue
  //     // Pattern: "₹500 - ₹1500 (INR)",       "hotelImageUrl": "Insert Image URL H
  //     // Should be: "₹500 - ₹1500 (INR)", "hotelImageUrl": "Insert Image URL Here"
  //     cleanedTripData = cleanedTripData.replace(/"Insert Image URL H[^"]*"/g, '"https://example.com/placeholder.jpg"');

  //     // Fix other incomplete URL patterns
  //     cleanedTripData = cleanedTripData.replace(/"https:\s*"([a-zA-Z]+)"/g, '"https://example.com/placeholder.jpg", "$1"');
  //     cleanedTripData = cleanedTripData.replace(/"http:\s*"([a-zA-Z]+)"/g, '"http://example.com/placeholder.jpg", "$1"');

  //     // Fix incomplete "Insert Image URL Here" patterns
  //     cleanedTripData = cleanedTripData.replace(/"Insert Image URL[^"]*"/g, '"https://example.com/placeholder.jpg"');

  //     // Extract only the JSON part (from first { to last })
  //     const firstBrace = cleanedTripData.indexOf('{');
  //     const lastBrace = cleanedTripData.lastIndexOf('}');

  //     if (firstBrace === -1 || lastBrace === -1) {
  //       throw new Error('No valid JSON structure found');
  //     }

  //     cleanedTripData = cleanedTripData.substring(firstBrace, lastBrace + 1);

  //     console.log("Cleaned TripData after URL fix:", cleanedTripData);

  //     // Parse the cleaned data
  //     const parsedData = JSON.parse(cleanedTripData);
  //     console.log("Successfully parsed data:", parsedData);

  //     // Save to Firebase
  //     await setDoc(doc(db, "AiTrips", docId), {
  //       userSelection: formData,
  //       tripData: parsedData,
  //       userEmail: user?.email,
  //       id: docId,
  //     });

  //     console.log("Trip saved successfully!");
  //     setIsLoading(false);

  //     // Navigate to the trip view page (add this line if missing)
  //     navigate('/view-trip/' + docId);

  //   } catch (error) {
  //     console.error("Error saving trip:", error);
  //     console.error("Error details:", {
  //       name: error.name,
  //       message: error.message,
  //       stack: error.stack
  //     });

  //     // Log the problematic data for debugging
  //     console.error("Problematic data:", TripData);

  //     setIsLoading(false);

  //     // Show user-friendly error message
  //     alert('Error saving trip. Please try generating the trip again.');
  //   }
  // };*****************

  const SaveAiTrip = async (TripData) => {
    setIsLoading(true);
    try {
      console.log("formdata", formData);
      console.log("Original TripData:", TripData);
      const user = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();

      let cleanedTripData = TripData;

      // Remove markdown code blocks from beginning and end
      cleanedTripData = cleanedTripData.replace(/^```json\s*/g, "");
      cleanedTripData = cleanedTripData.replace(/```.*$/g, ""); // Remove ``` and everything after it

      // Remove JavaScript-style comments
      cleanedTripData = cleanedTripData.replace(/\/\/.*$/gm, "");

      // Remove trailing commas
      cleanedTripData = cleanedTripData.replace(/,(\s*[}\]])/g, "$1");

      // Remove control characters
      cleanedTripData = cleanedTripData.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

      // Fix incomplete URLs - this is the main issue
      // Pattern: "₹500 - ₹1500 (INR)",       "hotelImageUrl": "Insert Image URL H
      // Should be: "₹500 - ₹1500 (INR)", "hotelImageUrl": "Insert Image URL Here"
      cleanedTripData = cleanedTripData.replace(
        /"Insert Image URL H[^"]*"/g,
        '"https://example.com/placeholder.jpg"'
      );

      // Fix other incomplete URL patterns
      cleanedTripData = cleanedTripData.replace(
        /"https:\s*"([a-zA-Z]+)"/g,
        '"https://example.com/placeholder.jpg", "$1"'
      );
      cleanedTripData = cleanedTripData.replace(
        /"http:\s*"([a-zA-Z]+)"/g,
        '"http://example.com/placeholder.jpg", "$1"'
      );

      // Fix incomplete "Insert Image URL Here" patterns
      cleanedTripData = cleanedTripData.replace(
        /"Insert Image URL[^"]*"/g,
        '"https://example.com/placeholder.jpg"'
      );

      // Extract only the JSON part (from first { to last })
      const firstBrace = cleanedTripData.indexOf("{");
      const lastBrace = cleanedTripData.lastIndexOf("}");

      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No valid JSON structure found");
      }

      cleanedTripData = cleanedTripData.substring(firstBrace, lastBrace + 1);

      console.log("Cleaned TripData after URL fix:", cleanedTripData);

      // Parse the cleaned data
      const parsedData = JSON.parse(cleanedTripData);
      console.log("Successfully parsed data:", parsedData);

      // Clean formData to remove unsupported objects for Firebase
      const cleanedFormData = {
        ...parsedData,
      };
      const Cleaned = {
        ...formData,
      };

      console.log("Cleaned form data:", cleanedFormData);

      // Save to Firebase
      await setDoc(doc(db, "AiTrips", docId), {
        userSelection: cleanedFormData,
        tripData: cleanedFormData,
        userEmail: user?.email,
        id: docId,
      });

      console.log("Trip saved successfully!");
      setIsLoading(false);
      navigate("/view-trip/" + docId); // ✅ Navigate to the trip view page

      // Navigate to the trip view page (add this line if missing)
    } catch (error) {
      console.error("Error saving trip:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Log the problematic data for debugging
      console.error("Problematic data:", TripData);

      setIsLoading(false);

      // Show user-friendly error message
      alert("Error saving trip. Please try generating the trip again.");
    }
  };

  const getUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        OnGenerateTrips();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login Success:", tokenResponse);
      getUserProfile(tokenResponse);
    },
    onError: (error) => {
      console.log("Login Error:", error);
    },
  });

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl capitalize text-center">
        Tell us your travel preferences
      </h2>
      <p className="mt-3 text-gray-500 text-xl text-center">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preference.
      </p>
      <div className="mt-20 flex flex-col gap-10">
        {/* Destination Field */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your destination of choice?
          </h2>
          <div className="relative w-full">
            <GooglePlaceAutoComplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              className="border border-gray-300 rounded-md px-4 py-3 w-full shadow-sm focus:outline-none"
              onPlaceSelected={(place) => {
                setPlace(place);
                handleChange("location", place);
              }}
              placeholder="Select..."
            />
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Number of Days Field */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            className="w-full"
            onChange={(e) => {
              handleChange("noOfDays", e.target.value);
            }}
          />
        </div>

        {/* Budget Options */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedBudget(item.title);
                  handleChange("budget", item.title);
                }}
                className={`border rounded-xl p-5 bg-white shadow-md hover:shadow-lg hover:border-[#f56551] transition duration-300 cursor-pointer ${
                  selectedBudget === item.title
                    ? "shadow-xl border-[#f56551]"
                    : ""
                }`}
              >
                <div className="text-3xl mb-3 text-[#f56551]">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Number of Travelers */}
        <div>
          <h2 className="text-xl my-3 font-medium">How many travelers?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SelectTravelsList.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedTravellers(item.people);
                  handleChange("travellers", item.people);
                }}
                className={`border rounded-xl p-5 bg-white shadow-md hover:shadow-lg hover:border-[#f56551] transition duration-300 cursor-pointer ${
                  selectedTravellers === item.people
                    ? "shadow-xl border-[#f56551]"
                    : ""
                }`}
              >
                <div className="text-3xl mb-3 text-[#f56551]">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="my-10 flex justify-end">
        {isLoading ? (
          <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin " />
        ) : (
          <span>Generate Trip</span>
        )}
        <Button disabled={isLoading} onClick={OnGenerateTrips}>
          Generate Trip
        </Button>
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Sign in to the App with secure Google authentication.
            </DialogDescription>
          </DialogHeader>

          {/* Don't put these inside DialogDescription */}
          <img src="logo.svg" alt="App Logo" className="mx-auto mt-4" />

          <h2 className="font-bold text-lg mt-7 text-center">
            Sign In With Google
          </h2>

          <Button
            onClick={login}
            className="w-full mt-5 flex gap-4 items-center justify-center"
          >
            <FcGoogle className="h-7 w-7" />
            Sign In
          </Button>
        </DialogContent>
      </Dialog>
      ✅ Output Section
      {/* {tripResult && (
        <div className="bg-gray-50 p-6 rounded-xl shadow mt-10">
          <h2 className="text-xl font-bold mb-4 text-[#f56551]">🎉 Trip Plan Generated</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-800 overflow-x-auto">
            {(() => {
              try {
                return JSON.stringify(JSON.parse(tripResult), null, 2);
              } catch (e) {
                return tripResult;
              }
            })()}
          </pre>
        </div>
      )} */}
      {/* ✅ Output Section */}
      {/* {tripResult && (
  <TripOutput tripResult={tripResult} />
)} */}
    </div>
  );
}

export default CreateTrip;
