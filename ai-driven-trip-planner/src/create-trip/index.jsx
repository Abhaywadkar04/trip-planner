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
import TripOutput from "./trip-out";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedTravellers, setSelectedTravellers] = useState(null);
  const [tripResult, setTripResult] = useState(""); // ✅ result display
  const [openDialog, setOpenDialog] = useState(false);

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
    // const user = localStorage.getItem("user");
    // if (!user) {
    //   setOpenDialog(true);
    //   return;
    // }

    if (
      formData?.noOfDays > 5 &&
      (!formData.location || !formData.budget || !formData.travellers)
    ) {
      toast("Please fill all the fields");
      return;
    }

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
    } catch (err) {
      toast.error("Something went wrong with AI response");
      console.error(err);
    }
  };

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
        <Button onClick={OnGenerateTrips}>Generate Trip</Button>
      </div>

{/* 
            <Dialog open={openDialog} >
  <DialogContent>
    <DialogHeader>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog> */}



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
