"use client";

import React, { useState, useEffect } from "react";
import { useLoginStore } from "@/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const SignUp = () => {
  const setUser = useLoginStore((state) => state.setUser);
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useLoginStore((state) => state.setIsLoggedIn);
  const usersRef = collection(db, "users"); // Reference to the 'users' collection in Firestore
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/");
    }
  });

  // User state to store form data
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Add user to Firestore database
  const addUserToFirestore = async () => {
    const docRef = addDoc(usersRef, {
      email: userForm.email,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, userForm.email, userForm.password)
      .then((userCredential) => {
        // Signed up AND signed in per Firebase docs
        setUser(userCredential.user);
        addUserToFirestore();
        setIsLoggedIn(true);
        console.log("User signed up and signed in.");
        router.replace("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col m-4 p-4 h-screen">
      <span className="mt-4">Email</span>
      <input
        className="border border-gray-300 rounded-md p-2"
        name="email"
        type="text"
        placeholder="Email"
        onChange={onChange}
      />
      <span className="mt-4">Password</span>
      <input
        name="password"
        className="border border-gray-300 rounded-md p-2"
        type="password"
        onChange={onChange}
        placeholder="Password"
      />
      <span className="mt-4">Verify Password</span>
      <input
        className="border border-gray-300 rounded-md p-2"
        name="verifyPassword"
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <Button
        className="bg-blue-500 rounded-xl text-white mx-4 w-1/4 p-4 mt-10"
        onClick={onSubmit}
      >
        Sign Up
      </Button>
    </form>
  );
};

export default SignUp;
