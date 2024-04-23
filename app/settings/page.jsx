"use client";

import { blockchainInstance } from "@/bc-instance/data";

const SettingsPage = () => {
  // handle form submission to update settings
  const handleSubmit = (e) => {
    e.preventDefault();
    blockchainInstance.difficulty = e.target[0].value;
    blockchainInstance.miningReward = e.target[1].value;
    alert("Settings updated");
  };

  return (
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
  );
};

export default SettingsPage;
