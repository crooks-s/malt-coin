"use client";
import React, { useEffect, useState } from "react";
import { useLoginStore } from "@/store";
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "@/firebase/firebaseConfig"; 
import { CreateWallet } from "@/components/account/create-wallet";
import { AddWallet } from "@/components/account/add-wallet";
import { blockchainInstance } from "@/bc-instance/data"; 

const AccountPage = () => {
  const user = useLoginStore((state) => state.user);
  const [balance, setBalance] = useState(0);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  useEffect(() => {
    const fetchWalletData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setPublicKey(userData.publicKey || "No wallet address found");
            setPrivateKey(userData.privateKey || "No private key found");
            const balance = blockchainInstance.balanceOf(userData.publicKey);
            setBalance(balance);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching wallet data: ", error);
        }
      }
    };
    fetchWalletData();
  }, [user]);

  return (
    <div className="h-screen">
      {useLoginStore((state) => state.isLoggedIn) && user ? (
        <>
          <div className="pl-10">
            <h1 className="font-bold py-10 pl-10">Account Page</h1>
            <h2 className="font-semibold">Email</h2>
            <p>{user.email}</p>
            <h2 className="font-semibold pt-5">Account balance</h2>
            <p>{balance} maltcoins</p>
            <h2 className="font-semibold overflow-x-auto pt-5">
              Wallet Address (Public Key)
            </h2>
            <p className="max-w-xs overflow-hidden break-words">{publicKey}</p>
            <h2 className="font-semibold overflow-x-auto pt-5">Private Key</h2>
            <p className="max-w-xs overflow-hidden break-words">
              To be hidden: {privateKey}
            </p>
            <h2 className="font-semibold pt-5">No wallet?</h2>
            <AddWallet />
            <CreateWallet />
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
