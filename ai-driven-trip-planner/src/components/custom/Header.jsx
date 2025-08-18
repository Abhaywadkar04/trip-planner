import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
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
        window.location.reload(); // ❗ reload to reset state
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
    setUser(null); // ❗ trigger re-render
    console.log("User logged out");
    window.location.reload(); // ❗ reload to reset state
    // Redirect to login page after logout
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <img src="./logo.svg" alt="logo" onClick={() => window.location.href = '/'} />

      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/create-trip">
              <Button variant="outline">+ create trip</Button>
            </a>
            <a href="/my-trip">
              <Button variant="outline">My Trips</Button>
            </a>

            <Popover>
              <PopoverTrigger asChild>
                <img
                  src={user.picture}
                  alt="user"
                  className="w-10 h-10 rounded-full inline-block ml-2"
                />
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-3 p-4">
                  <Button variant="outline">My Profile</Button>
                  <Button onClick={handleLogout}>Sign out</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign in</Button>
        )}
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
    </div>
  );
}

export default Header;
