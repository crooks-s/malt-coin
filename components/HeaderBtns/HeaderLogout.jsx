"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";
import { useLoginStore } from "@/store"; // global state
import { useRouter } from "next/navigation";

const HeaderLogout = () => {
  const router = useRouter();

  const googleSignout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        useLoginStore.setState({ isLoggedIn: false });
        useLoginStore.setState({ user: null });
        console.log("User logged out.");
        router.push("/");
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <Button
      onClick={googleSignout}
      className={"bg-blue-500 rounded-xl text-white mx-4"}
    >
      Logout
    </Button>
  );
};

export default HeaderLogout;
