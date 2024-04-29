import React from "react";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";
import { useLoginStore } from "@/store"; // global state

const HeaderLogout = () => {

  const googleSignout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        useLoginStore.setState({ isLoggedIn: false });
        useLoginStore.setState({ user: null });
        console.log("User logged out.");
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <button
      onClick={googleSignout}
      className="rounded-md mt-2 p-1 bg-white text-xs"
    >
      Logout of Google
    </button>
  );
};

export default HeaderLogout;
