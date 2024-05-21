"use client";

import TableWrapper from "@/components/transactions/table-wrapper";
import { getBlockchainInstance } from "@/bc-instance/data";
import { useRouter } from "next/navigation";
import { useLoginStore } from "@/store";
import { useEffect, useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const PendingTransactionsPage = () => {
  const router = useRouter();
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const user = useLoginStore((state) => state.user);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [publicKey, setPublicKey] = useState("");
  const [blockchainInstance, setBlockchainInstance] = useState(null);

  const fetchWalletData = useCallback(async () => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPublicKey(userData.publicKey);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching wallet data: ", error);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        const instance = await getBlockchainInstance();
        setBlockchainInstance(instance);
        setPendingTransactions(instance.pendingTransactions);
      } catch (error) {
        console.error("Error fetching blockchain instance:", error);
      }
    };

    fetchBlockchainData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await fetchWalletData();
      // TODO: Fix this, public key is not being set in time
      if (!publicKey) {
        alert("Please create a wallet to start mining");
        return;
      }
      blockchainInstance.minePendingTransactions(publicKey);
      alert("Mining successful");
      router.push("/");
    } catch (error) {
      console.error("Mining failed", error);
      alert("Mining failed. Please try again.");
    }
  };

  return (
    <div className="h-screen">
      <TableWrapper transactions={pendingTransactions} />
      <div className="flex items-center justify-center pb-10 pt-14">
        {isLoggedIn ? (
          <button
            onClick={handleSubmit}
            className="bg-slate-500 text-white p-2 rounded-md "
          >
            Start Mining
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-slate-500 text-white p-2 rounded-md cursor-not-allowed "
            disabled={true}
          >
            Login to start mining
          </button>
        )}
      </div>
    </div>
  );
};

export default PendingTransactionsPage;
