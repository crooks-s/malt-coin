"use client";

import { useEffect, useState } from "react";
import { useLoginStore } from "@/store";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const user = useLoginStore((state) => state.user);
  const setUser = useLoginStore((state) => state.setUser);
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useLoginStore((state) => state.setIsLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        console.log("User logged in: ");
        setIsLoggedIn(true);
        router.replace("/");
      })
      .catch((error) => {
        console.error(error.message);
        alert("Invalid email or password");
      });
  };

  // Update email/password states on input change
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen">
      {errors.length > 0
        ? errors.map((error, index) => (
            <div
              key={index}
              className="bg-red-200 text-red-800 p-2 text-center"
            >
              {error}
            </div>
          ))
        : null}
      <div className="px-10 py-10">
        <span className="pr-5 font-semibold">Email</span>
        <input
          className="border border-gray-300 rounded-md p-2"
          name="email"
          type="text"
          value={email}
          onChange={onChange}
          placeholder="Email"
        />
      </div>
      <div className="px-10">
        <span className="pr-5 font-semibold">Password</span>
        <input
          className="border border-gray-300 rounded-md p-2"
          name="password"
          type="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
        />
      </div>
      <button
        type="submit"
        className="bg-slate-500 text-white p-2 rounded-md  mx-10 mt-10"
      >
        Submit
      </button>
    </form>
  );
};

export default LoginPage;
