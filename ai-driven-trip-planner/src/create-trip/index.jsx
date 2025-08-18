import React, { useState, useEffect } from "react";
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
  const [tripResult, setTripResult] = useState("");
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
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const response = await result.response.text();
      setTripResult(response);
      console.log("AI Response:", response);
      SaveAiTrip(response);
    } catch (err) {
      toast.error("Something went wrong with AI response");
      console.error(err);
    }
    setIsLoading(false);
  };

  const SaveAiTrip = async (TripData) => {
    setIsLoading(true);
    try {
      console.log("formdata", formData);
      console.log("Original TripData:", TripData);
      const user = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();
      let cleanedTripData = TripData;

      // Data cleaning logic (keeping your existing logic)
      cleanedTripData = cleanedTripData.replace(/^```json\s*/g, "");
      cleanedTripData = cleanedTripData.replace(/```.*$/g, "");
      cleanedTripData = cleanedTripData.replace(/\/\/.*$/gm, "");
      cleanedTripData = cleanedTripData.replace(/,(\s*[}\]])/g, "$1");
      cleanedTripData = cleanedTripData.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

      cleanedTripData = cleanedTripData.replace(
        /"Insert Image URL H[^"]*"/g,
        '"https://example.com/placeholder.jpg"'
      );

      cleanedTripData = cleanedTripData.replace(
        /"https:\s*"([a-zA-Z]+)"/g,
        '"https://example.com/placeholder.jpg", "$1"'
      );

      cleanedTripData = cleanedTripData.replace(
        /"http:\s*"([a-zA-Z]+)"/g,
        '"http://example.com/placeholder.jpg", "$1"'
      );

      cleanedTripData = cleanedTripData.replace(
        /"Insert Image URL[^"]*"/g,
        '"https://example.com/placeholder.jpg"'
      );

      const firstBrace = cleanedTripData.indexOf("{");
      const lastBrace = cleanedTripData.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No valid JSON structure found");
      }
      cleanedTripData = cleanedTripData.substring(firstBrace, lastBrace + 1);

      console.log("Cleaned TripData after URL fix:", cleanedTripData);
      const parsedData = JSON.parse(cleanedTripData);
      console.log("Successfully parsed data:", parsedData);

      const cleanedFormData = {
        ...parsedData,
      };

      const Cleaned = {
        ...formData,
      };

      console.log("Cleaned form data:", cleanedFormData);

      await setDoc(doc(db, "AiTrips", docId), {
        userSelection: cleanedFormData,
        tripData: cleanedFormData,
        userEmail: user?.email,
        id: docId,
      });

      console.log("Trip saved successfully!");
      setIsLoading(false);
      navigate("/view-trip/" + docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 pt-10 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full mb-6">
            <span className="text-2xl">✈️</span>
          </div>
          <h2 className="font-bold text-4xl capitalize bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Tell us your travel preferences
          </h2>
          <p className="mt-3 text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Just provide some basic information, and our trip planner will
            generate a customized itinerary based on your preferences.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Destination Field */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">🌍</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  What is your destination of choice?
                </h2>
              </div>
              <div className="relative">
                <GooglePlaceAutoComplete
                  apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                  className="border-2 border-gray-200 rounded-xl px-6 py-4 w-full shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                  onPlaceSelected={(place) => {
                    setPlace(place);
                    handleChange("location", place);
                  }}
                  placeholder="Search for destinations..."
                />
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg
                    className="h-6 w-6 text-gray-400"
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
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">📅</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  How many days are you planning your trip?
                </h2>
              </div>
              <Input
                placeholder="Ex. 3"
                type="number"
                className="border-2 border-gray-200 rounded-xl px-6 py-4 text-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200"
                onChange={(e) => {
                  handleChange("noOfDays", e.target.value);
                }}
              />
            </div>

            {/* Budget Options */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600">💰</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  What is your budget?
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SelectBudgetOptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedBudget(item.title);
                      handleChange("budget", item.title);
                    }}
                    className={`border-2 rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl hover:border-orange-400 hover:scale-105 transition-all duration-300 cursor-pointer group ${
                      selectedBudget === item.title
                        ? "shadow-xl border-orange-400 ring-4 ring-orange-100 scale-105"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Number of Travelers */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">👥</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  How many travelers?
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SelectTravelsList.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedTravellers(item.people);
                      handleChange("travellers", item.people);
                    }}
                    className={`border-2 rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl hover:border-orange-400 hover:scale-105 transition-all duration-300 cursor-pointer group ${
                      selectedTravellers === item.people
                        ? "shadow-xl border-orange-400 ring-4 ring-orange-100 scale-105"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-4">
              {isLoading && (
                <AiOutlineLoading3Quarters className="h-8 w-8 animate-spin text-orange-500" />
              )}
              <Button
                disabled={isLoading}
                onClick={OnGenerateTrips}
                className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Generating Your Trip..." : "Generate Trip"}
              </Button>
            </div>
          </div>
        </div>

        {/* Login Dialog */}
        <Dialog open={openDialog}>
          <DialogContent className="rounded-2xl p-8 max-w-md mx-auto">
            <DialogHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                Sign In Required
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-lg">
                Sign in to the App with secure Google authentication to generate
                your personalized trip.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8">
              <img
                src="logo.svg"
                alt="App Logo"
                className="mx-auto h-16 mb-6"
              />
              <Button
                onClick={login}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-300 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-4 text-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FcGoogle className="h-8 w-8" />
                Sign In with Google
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CreateTrip;
