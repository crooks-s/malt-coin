"use client";

import TableWrapper from "@/components/transactions/table-wrapper";
import { blockchainInstance, walletKeys } from "@/bc-instance/data";
import { useRouter } from "next/navigation";

const PendingTransactionsPage = () => {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    blockchainInstance.minePendingTransactions(walletKeys[0].publicKey);
    router.push("/");
    alert("Mining successful");
  };

  return (
    <>
      <TableWrapper transactions={blockchainInstance.pendingTransactions} />
      <div className="flex items-center justify-center pb-10 pt-14">
        <button
          onClick={handleSubmit}
          className="bg-slate-500 text-white p-2 rounded-md "
        >
          Start Mining
        </button>
      </div>
    </>
  );
};

export default PendingTransactionsPage;
