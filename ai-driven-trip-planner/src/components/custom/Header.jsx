import React, { useEffect } from "react";
import { Button } from "../ui/button";

function Header() {
  const user = localStorage.getItem("user");
  useEffect(() => {
    console.log("User data:", user);
  });
  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <img src="./logo.svg" alt="logo"></img>
      <div>
        {user ? (
          <div>
            <Button variant="outline">My Trips</Button>

            <img
              src={user?.picture}
              alt="user"
              className="w-10 h-10 rounded-full inline-block ml-2"
            />
          </div>
        ) : (
          <Button>Sign in</Button>
        )}
      </div>
    </div>
  );
}

export default Header;
