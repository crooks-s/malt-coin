"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import users from "@/bc-instance/users/data";

const SignUp = () => {
  const idCounter = users.length + 1;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (Object.keys(errors).length === 0) {
      users.push({ id: idCounter, ...data });
      console.log("User data:", data);
      console.log("Updated users:", users);
    } else {
      console.log("Form has errors:", errors);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col m-4 p-4">
      <span>First Name</span>
      <input
        className="border border-gray-300 rounded-md p-2"
        type="text"
        placeholder="First Name"
        {...register("First Name", { required: true })}
      />
      <span className="mt-4">Last Name</span>
      <input
        className="border border-gray-300 rounded-md p-2"
        type="text"
        placeholder="Last Name"
        {...register("Last Name", { required: true })}
      />
      <span className="mt-4">Email</span>
      <input
        className="border border-gray-300 rounded-md p-2"
        type="text"
        placeholder="Email"
        {...register("Email", { required: true, pattern: /^\S+@\S+$/i })}
      />
      <span className="mt-4">Username</span>
      <input
        className="border border-gray-300 rounded-md p-2"
        type="text"
        placeholder="Username"
        {...register}
      />
      <span className="mt-4">Password</span>
      <input
        className="border border-gray-300 rounded-md p-2"
        type="password"
        placeholder="Password"
        {...register}
      />
      <span className="mt-4">Age</span>
      <input
        className="border border-gray-300 rounded-md p-2"
        type="number"
        placeholder="Age"
        {...register("Age", { max: 125, min: 18 })}
      />

      <Button
        className="bg-blue-500 rounded-xl text-white mx-4 w-1/4 p-4 m-10"
        onClick={onSubmit}
      >
        Sign Up
      </Button>
    </form>
  );
};

export default SignUp;
