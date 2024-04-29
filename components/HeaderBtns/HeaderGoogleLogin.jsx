import React from 'react';
import { Button } from "@/components/ui/button";
import { useLoginStore } from "@/store"; // global state
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

const HeaderGoogleLogin = () => {
  const setUser = useLoginStore((state) => state.setUser);
  const setIsLoggedIn = useLoginStore((state) => state.setIsLoggedIn);
  
  const googleSignin = (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  /* Check if user is logged in */
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedIn(true);
      setUser(auth.currentUser);
    } else {
      setUser(null);
    }
  });

  return (
    <Button
    onClick={googleSignin}
    className={"bg-blue-500 rounded-xl text-white mx-4"}
  >
    Google Login
  </Button>
  )
}

export default HeaderGoogleLogin