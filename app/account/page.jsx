"use client";
import React from "react";
import users from "@/bc-instance/users/data";
import { useLoginStore } from "@/store";

const AccountPage = () => {
  const user = useLoginStore((state) => state.user);

  return (
    <>
      {useLoginStore((state) => state.isLoggedIn) ? (
        <>
          <div>
            <h1 className="font-bold">Account Page</h1>
            <h2 className="font-semibold">Username</h2>
            <p>{user.username}</p>
            <h2 className="font-semibold">Email</h2>
            <p>{user.email}</p>
            <h2 className="font-semibold">Full Name</h2>
            <p>
              {user.firstName} {user.lastName}
            </p>
            <h2 className="font-semibold">Account balance</h2>
            <p>{user.maltWallet} maltcoins</p>
          </div>
        </>
      ) : (
        <h1 className="text-2xl font-bold mt-8 ml-10">
          Please login to see your account details
        </h1>
      )}
    </>
  );
};

export default AccountPage;
