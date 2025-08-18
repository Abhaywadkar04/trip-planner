import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Header() {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate(); // Move this inside the component

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
        setUser(res.data);
        setOpenDialog(false);
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    googleLogout();
    setUser(null);
    console.log("User logged out");
  };

  const handleHomeNavigation = () => {
    navigate("/");
  };

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer" onClick={handleHomeNavigation}>
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg mr-3 hover:scale-105 transition-transform duration-200">
              <span className="text-xl">✈️</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                TravelAI
              </h1>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-xl transition-all duration-200"
                  onClick={() => navigate("/create-trip")}
                >
                  Create Trip
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-xl transition-all duration-200"
                  onClick={() => navigate("/my-trip")}
                >
                  My Trips
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all duration-200">
                      <img
                        src={user.picture}
                        alt="user"
                        className="w-10 h-10 rounded-full ring-2 ring-gray-200 hover:ring-blue-300 transition-all duration-200"
                      />
                      <div className="hidden sm:block">
                        <svg
                          className="h-4 w-4 text-gray-500"
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
                  </PopoverTrigger>
                  <PopoverContent className="w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-2">
                    <div className="flex flex-col gap-1">
                      <div className="px-3 py-2 border-b border-gray-100 mb-2">
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <span className="mr-2">👤</span>
                        My Profile
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <span className="mr-2">⚙️</span>
                        Settings
                      </Button>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <Button
                          onClick={handleLogout}
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <span className="mr-2">🚪</span>
                          Sign out
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Button
                onClick={() => setOpenDialog(true)}
                className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-medium py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="rounded-2xl p-8 max-w-md mx-auto bg-white border-0 shadow-2xl">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔐</span>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-lg leading-relaxed">
              Sign in to the App with secure Google authentication to access your personalized travel experience.
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
              className="w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-300 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-4 text-lg shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <FcGoogle className="h-8 w-8 group-hover:scale-110 transition-transform duration-200" />
              Sign In with Google
            </Button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;