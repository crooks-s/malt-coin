"use client";
import React, { useEffect, useState } from "react";
import { useLoginStore } from "@/store";
import { blockchainInstance } from "@/bc-instance/data";

const AccountPage = () => {
  const user = useLoginStore((state) => state.user);
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (user) {
      setBalance(blockchainInstance.balanceOf(user.publicKey));
    }
  }, [user]);

  return (
    <div className="h-screen">
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
            <p>{balance} maltcoins</p>
            <h2 className="font-semibold overflow-x-auto">Wallet Address</h2>
            <p className="max-w-xs overflow-hidden break-words">
              {user.publicKey}
            </p>
          </div>
        </>
      ) : (
        <h1 className="text-2xl font-bold mt-8 ml-10">
          Please login to see your account details
        </h1>
      )}
    </div>
  );
};

export default AccountPage;
