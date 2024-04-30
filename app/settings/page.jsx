"use client";

import { blockchainInstance } from "@/bc-instance/data";
import { useLoginStore } from "@/store";

const SettingsPage = () => {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);

  // handle form submission to update settings
  const handleSubmit = (e) => {
    e.preventDefault();
    blockchainInstance.difficulty = e.target[0].value;
    blockchainInstance.miningReward = e.target[1].value;
    alert("Settings updated");
  };

  return (
    <>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <div className="px-10 py-10">
            <span className="pr-5 font-semibold">Difficulty</span>
            <input
              className="border border-gray-300 rounded-md p-2"
              type="number"
              min="0"
              placeholder="Difficulty"
              defaultValue={blockchainInstance.difficulty}
            />
          </div>
          <div className="px-10">
            <span className="pr-5 font-semibold">Mining Reward Amount</span>
            <input
              className="border border-gray-300 rounded-md p-2"
              type="number"
              min="0"
              placeholder="Mining reward amount"
              defaultValue={blockchainInstance.miningReward}
            />
          </div>
          <button
            type="submit"
            className="bg-slate-500 text-white p-2 rounded-md  mx-10 my-10"
          >
            Submit
          </button>
        </form>
      ) : (
        <h1 className="text-2xl font-bold mt-8 ml-10">
          Please login to update settings
        </h1>
      
      )}
    </>
  );
};

export default SettingsPage;
