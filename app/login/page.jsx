"use client";

import users from "@/users/data";
import { useState } from "react";
import { useLoginStore } from "@/store";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  // console.log(useLoginStore((state) => state.isLoggedIn));

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = Object.values(users).find(
      (user) => user.username === username
    );

    if (!user || user.password !== password) {
      setErrors(["Invalid username or password"]);
      return;
    }

    if (username === user.username && password === user.password) {
      useLoginStore.setState({ isLoggedIn: true });
      // console.log(useLoginStore((state) => state.isLoggedIn));
      alert("Login successful");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <span className="pr-5 font-semibold">Username</span>
        <input
          className="border border-gray-300 rounded-md p-2"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
      </div>
      <div className="px-10">
        <span className="pr-5 font-semibold">Password</span>
        <input
          className="border border-gray-300 rounded-md p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      <button
        type="submit"
        className="bg-slate-500 text-white p-2 rounded-md  mx-10 my-10"
      >
        Submit
      </button>
    </form>
  );
};

export default LoginPage;
