"use client";

import { blockchainInstance, walletKeys, users } from "@/bc-instance/data";
import { Transaction } from "@/bc-instance/blockchain";
import { useLoginStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RadioBtn from "@/components/transactions/radio-btns";

const CreateTransaction = () => {
  const user = useLoginStore((state) => state.user);
  const router = useRouter();
  const [otherUsers, setOtherUsers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const handleRecipientChange = (e) => {
    setSelectedRecipient(e.target.value);
  };

  useEffect(() => {
    if (user) {
      setSenderAddress(user.publicKey); // get sender address
      setOtherUsers(users.filter((u) => u.username !== user.username)); // get other users
      setBalance(blockchainInstance.balanceOf(user.publicKey)); // get balance
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!senderAddress || !selectedRecipient || !amount) {
      e.preventDefault();
      alert("Please fill in all fields");
      return;
    } else if (amount > balance) {
      e.preventDefault();
      alert("Insufficient balance");
      return;
    } else if (amount <= 0) {
      e.preventDefault();
      alert("Please enter a valid amount");
      return;
    }

    const tx = new Transaction(
      senderAddress,
      selectedRecipient,
      amount,
      10,
      new Date().toLocaleString()
    );
    tx.signTransaction(user.keyObj);
    blockchainInstance.addTransaction(tx);
    alert("Transaction created");
    router.push("/transactions/pending");
  };

  return (
    <div className="h-screen">
      {useLoginStore((state) => state.isLoggedIn) && otherUsers.length > 0 ? (
        <>
          <h1 className="text-2xl font-bold mt-8 ml-10">
            Create a New Transaction
          </h1>
          <h2 className="text-lg ml-10 pt-10 font-semibold">
            Current account balance:
            <span className="text-xl"> {balance}</span>
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
                defaultValue={user.publicKey}
              />
            </div>
            <div className="px-10 w-full">
              <span className="pr-5 font-semibold">Recipient Address</span>
              <input
                className="border border-gray-300 rounded-md p-2 block w-full overflow-auto break-words"
                type="text"
                value={selectedRecipient}
                onChange={handleRecipientChange}
                placeholder="Recipient Address"
              />
              <>
                {otherUsers.map((user) => (
                  <RadioBtn
                    key={user.publicKey}
                    label={user.username}
                    value={user.publicKey}
                    checked={selectedRecipient === user.publicKey}
                    onChange={handleRecipientChange}
                  />
                ))}
              </>
            </div>
            <div className="px-10 pt-10 w-full">
              <span className="pr-5 font-semibold">Amount</span>
              <input
                className="border border-gray-300 rounded-md p-2"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
