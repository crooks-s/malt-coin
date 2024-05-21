"use client";

import { blockchainInstance, getBlockchainInstance } from "@/bc-instance/data";
import { Transaction } from "@/bc-instance/blockchain";
import { useLoginStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RadioBtn from "@/components/transactions/radio-btns";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const CreateTransaction = () => {
  const user = useLoginStore((state) => state.user);
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");

  const fetchWalletData = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFromAddress(userData.publicKey);
          const instance = await getBlockchainInstance();
          const balance = instance.balanceOf(userData.publicKey);
          setBalance(balance);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching wallet data: ", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const fetchPrivateKey = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.privateKey;
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching private key: ", error);
    }
  };

  const handleRecipientChange = (e) => {
    setToAddress(e.target.value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Convert the value to a number, and only set it if it's a valid number
    const numberValue = value === "" ? 0 : Number(value);
    if (!isNaN(numberValue)) {
      setAmount(numberValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fromAddress || !toAddress || !amount) {
      alert("Please fill in all fields");
      return;
    } else if (amount > balance) {
      alert("Insufficient balance");
      return;
    } else if (amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const tx = new Transaction(
      fromAddress,
      toAddress,
      amount,
      10,
      new Date().toLocaleString()
    );

    fetchPrivateKey()
      .then((privateKey) => {
        tx.signTransaction(privateKey);
        blockchainInstance.addTransaction(tx);
      })
      .catch((error) => {
        throw new Error(error);
      });

    alert("Transaction created");
    router.push("/transactions/pending");
  };

  return (
    <div className="h-screen">
      {useLoginStore((state) => state.isLoggedIn) ? (
        <>
          <h1 className="text-2xl font-bold mt-8 ml-10">
            Create a New Transaction
          </h1>
          <h2 className="text-lg ml-10 pt-10 font-semibold">
            Current account balance:
            <span className="text-xl"> {}</span>
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap items-center w-full"
          >
            <div className="px-10 py-10 w-full">
              <span className="pr-5 font-semibold">Your Wallet Address</span>
              <input
                className="border border-gray-300 rounded-md p-2 block w-full overflow-auto break-words"
                disabled={true}
                type="text"
                defaultValue={fromAddress}
              />
            </div>
            <div className="px-10 w-full">
              <span className="pr-5 font-semibold">Recipient Address</span>
              <input
                className="border border-gray-300 rounded-md p-2 block w-full overflow-auto break-words"
                type="text"
                value={toAddress}
                onChange={handleRecipientChange}
                placeholder="Recipient Address"
              />
            </div>
            <div className="px-10 pt-10 w-full">
              <span className="pr-5 font-semibold">Amount</span>
              <input
                className="border border-gray-300 rounded-md p-2"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min="0"
                max={balance}
                placeholder="Amount"
              />
            </div>
            <div className="px-10 pt-10 w-full">
              <span className="pr-5 font-semibold">Fee</span>
              <input
                className="border border-gray-300 rounded-md p-2"
                type="number"
                value="10"
                disabled={true}
              />
            </div>
            <div className="px-10 pt-10 w-full">
              <span className="pr-5 font-semibold">Total deduction</span>
              <span className="border border-gray-300 rounded-md p-2">
                {parseInt(amount) + 10}
              </span>
            </div>
            <button
              type="submit"
              className="bg-slate-500 text-white p-2 rounded-md  mx-10 my-10"
            >
              Sign and Submit Transaction
            </button>
          </form>
        </>
      ) : (
        <div className="h-screen">
          <h1 className="text-2xl font-bold mt-8 ml-10">
            Please login to create a transaction
          </h1>
        </div>
      )}
    </div>
  );
};

export default CreateTransaction;
