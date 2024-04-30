"use client";

import TableWrapper from "@/components/transactions/table-wrapper";
import { blockchainInstance } from "@/bc-instance/data";
import { useRouter } from "next/navigation";
import { useLoginStore } from "@/store";

const PendingTransactionsPage = () => {
  const router = useRouter();
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);

  const handleSubmit = (e) => {
    e.preventDefault();
    blockchainInstance.minePendingTransactions(user.publicKey);
    router.push("/");
    alert("Mining successful");
  };

  return (
    <>
      <TableWrapper transactions={blockchainInstance.pendingTransactions} />
      <div className="flex items-center justify-center pb-10 pt-14">
        {isLoggedIn ? (
          <button
            onClick={handleSubmit}
            className="bg-slate-500 text-white p-2 rounded-md "
          >
            Start Mining
          </button>
        ) : 
        <button
        onClick={handleSubmit}
        className="bg-slate-500 text-white p-2 rounded-md cursor-not-allowed "
        disabled={true}
      >
        Login to mine
      </button>}
      </div>
    </>
  );
};

export default PendingTransactionsPage;
