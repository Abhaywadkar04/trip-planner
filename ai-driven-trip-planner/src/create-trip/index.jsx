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

// Beautiful Loading Component

const TravelLoadingScreen = ({ destination, days }) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const [progress, setProgress] = useState(0);

  const loadingMessages = [
    "🌍 Analyzing your dream destination...",

    "🧠 AI is crafting your perfect itinerary...",

    "🏨 Finding the best accommodations...",

    "🍽️ Discovering amazing local cuisines...",

    "🎯 Optimizing your travel experience...",

    "✨ Almost ready! Final touches...",
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;

        return prev + Math.random() * 15;
      });
    }, 300);

    return () => {
      clearInterval(messageInterval);

      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 z-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* Animated Travel Scene */}

        <div className="relative mb-12">
          {/* Road */}

          <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>

            {/* Road markings */}

            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white opacity-60 transform -translate-y-1/2">
              <div className="flex justify-between items-center h-full">
                <div className="w-8 h-0.5 bg-yellow-300 animate-ping"></div>

                <div
                  className="w-8 h-0.5 bg-yellow-300 animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>

                <div
                  className="w-8 h-0.5 bg-yellow-300 animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>

                <div
                  className="w-8 h-0.5 bg-yellow-300 animate-ping"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Animated Bus */}

          <div className="relative">
            <div
              className="inline-block animate-bounce"
              style={{ animationDuration: "2s" }}
            >
              <div className="relative">
                {/* Bus Body */}

                <div className="w-32 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg shadow-xl relative">
                  {/* Windows */}

                  <div className="absolute top-2 left-2 right-2 flex gap-1">
                    <div className="flex-1 h-6 bg-gradient-to-b from-sky-200 to-sky-100 rounded-sm border border-white/50"></div>

                    <div className="w-0.5 h-6 bg-blue-600"></div>

                    <div className="flex-1 h-6 bg-gradient-to-b from-sky-200 to-sky-100 rounded-sm border border-white/50"></div>

                    <div className="w-0.5 h-6 bg-blue-600"></div>

                    <div className="flex-1 h-6 bg-gradient-to-b from-sky-200 to-sky-100 rounded-sm border border-white/50"></div>
                  </div>

                  {/* Door */}

                  <div className="absolute top-2 right-1 w-4 h-10 bg-gradient-to-b from-gray-300 to-gray-400 rounded-sm border border-white/50"></div>

                  {/* Bus details */}

                  <div className="absolute bottom-1 left-2 right-2 h-1 bg-white/30 rounded-full"></div>

                  {/* Headlights */}

                  <div className="absolute top-6 -left-1 w-2 h-3 bg-yellow-300 rounded-full shadow-lg animate-pulse"></div>

                  {/* Wheels */}

                  <div className="absolute -bottom-3 left-3 w-6 h-6 bg-gray-800 rounded-full shadow-lg">
                    <div className="absolute inset-1 bg-gray-600 rounded-full">
                      <div className="absolute inset-1 bg-gray-400 rounded-full animate-spin">
                        <div className="absolute top-0.5 left-1/2 w-0.5 h-1 bg-gray-200 transform -translate-x-1/2"></div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-3 right-3 w-6 h-6 bg-gray-800 rounded-full shadow-lg">
                    <div className="absolute inset-1 bg-gray-600 rounded-full">
                      <div className="absolute inset-1 bg-gray-400 rounded-full animate-spin">
                        <div className="absolute top-0.5 left-1/2 w-0.5 h-1 bg-gray-200 transform -translate-x-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exhaust smoke */}

                <div className="absolute -right-8 top-4">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-ping opacity-60"></div>

                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-ping opacity-40 ml-1 -mt-1"
                    style={{ animationDelay: "0.3s" }}
                  ></div>

                  <div
                    className="w-1 h-1 bg-gray-500 rounded-full animate-ping opacity-20 ml-2 -mt-1"
                    style={{ animationDelay: "0.6s" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Floating destination tag */}

            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-blue-200">
              <div className="text-sm font-semibold text-blue-600 flex items-center gap-2">
                <span className="animate-pulse">📍</span>

                {destination || "Your Destination"}
              </div>
            </div>

            {/* Floating clouds */}

            <div className="absolute -top-20 -left-20 opacity-40">
              <div className="w-16 h-8 bg-white rounded-full animate-float"></div>

              <div
                className="w-12 h-6 bg-white rounded-full -mt-2 ml-4 animate-float"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            <div className="absolute -top-24 right-0 opacity-30">
              <div
                className="w-20 h-10 bg-white rounded-full animate-float"
                style={{ animationDelay: "2s" }}
              ></div>

              <div
                className="w-16 h-8 bg-white rounded-full -mt-3 ml-2 animate-float"
                style={{ animationDelay: "3s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Loading Messages */}

        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Creating Your Perfect Trip
          </h2>

          <div className="h-8 flex items-center justify-center">
            <p
              className="text-xl text-gray-600 animate-fade-in-out"
              key={currentMessage}
            >
              {loadingMessages[currentMessage]}
            </p>
          </div>
        </div>

        {/* Progress Bar */}

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>

            <span>{Math.round(progress)}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Trip Details */}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-500">📍</span>

              <span className="text-gray-600">Destination:</span>

              <span className="font-semibold text-gray-800">
                {destination || "Selected"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-green-500">📅</span>

              <span className="text-gray-600">Duration:</span>

              <span className="font-semibold text-gray-800">
                {days || "X"} days
              </span>
            </div>
          </div>
        </div>

        {/* Fun fact */}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 italic">
            💡 Did you know? Our AI analyzes over 10,000 travel data points to
            create your perfect itinerary!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in-out {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }

          20% {
            opacity: 1;
            transform: translateY(0);
          }

          80% {
            opacity: 1;
            transform: translateY(0);
          }

          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(100%);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

function CreateTrip() {
  const [place, setPlace] = useState();

  const [formData, setFormData] = useState({});

  const [selectedBudget, setSelectedBudget] = useState(null);

  const [selectedTravellers, setSelectedTravellers] = useState(null);

  const [tripResult, setTripResult] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState(null); // Add user state

  const navigate = useNavigate();

  // Initialize user state from localStorage on component mount

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,

      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Function to validate all required fields

  const validateForm = () => {
    const requiredFields = {
      location: formData?.location,

      noOfDays: formData?.noOfDays && parseInt(formData.noOfDays) > 0,

      budget: formData?.budget,

      travellers: formData?.travellers,
    };

    const missingFields = [];

    if (!requiredFields.location) missingFields.push("Destination");

    if (!requiredFields.noOfDays) missingFields.push("Number of days");

    if (!requiredFields.budget) missingFields.push("Budget");

    if (!requiredFields.travellers) missingFields.push("Number of travelers");

    return { isValid: missingFields.length === 0, missingFields };
  };

  const OnGenerateTrips = async () => {
    // Check if user is logged in

    if (!user) {
      setOpenDialog(true);

      return;
    }

    // Validate all required fields

    const validation = validateForm();

    if (!validation.isValid) {
      toast.error(
        `Please fill the following fields: ${validation.missingFields.join(
          ", "
        )}`
      );

      return;
    }

    // Additional validation for days (should be reasonable)

    if (parseInt(formData.noOfDays) > 30) {
      toast.error("Please enter a reasonable number of days (maximum 30)");

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

      setIsLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    try {
      console.log("formdata", formData);

      console.log("Original TripData:", TripData);

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

        const userData = res.data;

        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData); // Update user state immediately

        setOpenDialog(false);

        // Don't call OnGenerateTrips here, let user click the button again

        toast.success(
          "Successfully logged in! You can now generate your trip."
        );
      })

      .catch((err) => {
        console.log(err);

        toast.error("Login failed. Please try again.");
      });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login Success:", tokenResponse);

      getUserProfile(tokenResponse);
    },

    onError: (error) => {
      console.log("Login Error:", error);

      toast.error("Login failed. Please try again.");
    },
  });

  // Check if form is valid for button state

  const validation = validateForm();

  const isFormValid = validation.isValid && user;

  // Show loading screen when generating trip

  if (isLoading) {
    return (
      <TravelLoadingScreen
        destination={formData?.location?.formatted_address?.split(",")[0]}
        days={formData?.noOfDays}
      />
    );
  }

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

          {/* User Status Indicator */}

          {user && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
              <span className="text-sm">✓ Logged in as {user.name}</span>
            </div>
          )}
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

                {!formData?.location && (
                  <span className="text-red-500 text-sm ml-2">*Required</span>
                )}
              </div>

              <div className="relative">
                <GooglePlaceAutoComplete
                  apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                  className={`border-2 rounded-xl px-6 py-4 w-full shadow-sm focus:outline-none transition-all duration-200 text-lg ${
                    formData?.location
                      ? "border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                  onPlaceSelected={(place) => {
                    setPlace(place);

                    handleChange("location", place);
                  }}
                  placeholder="Search for destinations..."
                />

                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  {formData?.location ? (
                    <svg
                      className="h-6 w-6 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
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
                  )}
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

                {(!formData?.noOfDays || parseInt(formData.noOfDays) <= 0) && (
                  <span className="text-red-500 text-sm ml-2">*Required</span>
                )}
              </div>

              <Input
                placeholder="Ex. 3"
                type="number"
                min="1"
                max="30"
                className={`border-2 rounded-xl px-6 py-4 text-lg transition-all duration-200 ${
                  formData?.noOfDays && parseInt(formData.noOfDays) > 0
                    ? "border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    : "border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                }`}
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

                {!formData?.budget && (
                  <span className="text-red-500 text-sm ml-2">*Required</span>
                )}
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

                {!formData?.travellers && (
                  <span className="text-red-500 text-sm ml-2">*Required</span>
                )}
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

          <div className="mt-16 flex flex-col items-center gap-4">
            {!user && (
              <p className="text-gray-600 text-center">
                Please sign in to generate your trip
              </p>
            )}

            {!validation.isValid && user && (
              <p className="text-red-600 text-center">
                Missing: {validation.missingFields.join(", ")}
              </p>
            )}

            <Button
              disabled={!isFormValid || isLoading}
              onClick={OnGenerateTrips}
              className={`font-bold py-4 px-12 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform ${
                isFormValid && !isLoading
                  ? "bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } disabled:transform-none`}
            >
              {!user
                ? "Sign In Required"
                : isFormValid
                ? "Generate Trip"
                : "Complete All Fields"}
            </Button>
          </div>
        </div>

        {/* Login Dialog */}

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
              <div className="flex items-center justify-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-orange-100 rounded-lg">
                  <span className="text-xl">✈️</span>
                </div>
              </div>

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
