"use client";

import { blockchainInstance, walletKeys } from "@/bc-instance/data";
import { Transaction } from "@/bc-instance/blockchain";

const CreateTransaction = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const senderAddress = e.target[0].value;
    const recipientAddress = e.target[1].value;
    const amount = e.target[2].value;

    if (!senderAddress || !recipientAddress || !amount) {
      e.preventDefault();
      alert("Please fill in all fields");
      return; 
    }

    // for testing purposes. this should be removed and changed to the current date
    let date = new Date(2024, 2, 2);
    let ms = date.getTime();

    const tx = new Transaction(
      senderAddress,
      recipientAddress,
      amount,
      ms // temp date for testing
    );
    tx.signTransaction(walletKeys[0].keyObj); // temp using first key
    blockchainInstance.addTransaction(tx);
    e.target[1].value = ""; 
    e.target[2].value = "";
    alert("Transaction created");
  };

  return (
    <>
    <h1 className="text-2xl font-bold mt-8 ml-10">Create a New Transaction</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center w-full"
      >
        <div className="px-10 py-10 w-full">
          <span className="pr-5 font-semibold">Sender Address</span>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            placeholder="Sender Address"
            defaultValue={walletKeys[0].publicKey} // temp using first key
          />
        </div>
        <div className="px-10 w-full">
          <span className="pr-5 font-semibold">Recipient Address</span>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            placeholder="Recipient Address"
          />
        </div>
        <div className="px-10 pt-10 w-full">
          <span className="pr-5 font-semibold">Amount</span>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="number"
            min="0"
            placeholder="Amount"
          />
        </div>
        <button
          type="submit"
          className="bg-slate-500 text-white p-2 rounded-md  mx-10 my-10"
        >
          Sign and Submit Transaction
        </button>
      </form>
    </>
  );
};

export default CreateTransaction;
