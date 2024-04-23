"use client";
import { useState } from "react";

import { blockchainInstance } from "@/bc-instance/data";

import CardWrapper from "@/components/card-wrapper";
import TableWrapper from "@/components/table-wrapper";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  const [blockNum, setBlockNum] = useState(0); // block number
  const selectedBlock = blockchainInstance.chain[blockNum]; // selected block using block number
  return (
    <>
      <Header />
      <h1 className="px-4 text-xl font-semibold pt-10 text-center">
        Blocks on Chain
      </h1>
      <h2 className="text-center text-lg">
        Current Height: {blockchainInstance.chain.length}
      </h2>
      <div className="flex w-full justify-center flex-wrap my-10 px-2">
        {blockchainInstance.chain.map((block, index) => (
          <CardWrapper
            key={index}
            headerLabel={`Block #${index === 0 ? "0 - Genesis" : index}`}
            hash={block.hash}
            previousHash={block.previousHash}
            nonce={block.nonce}
            timestamp={block.timestamp}
            onClick={() => setBlockNum(index)}
          />
        ))}
      </div>
      <h1 className="px-4 text-xl font-semibold pt-10 pb-5 text-center">
        List of Transactions in Block #{blockNum}
      </h1>
      {selectedBlock.transactions.length > 0 ? (
        <TableWrapper selectedBlock={selectedBlock} />
      ) : (
        <p className="text-center">No transactions in this block</p>
      )}
      <Footer />
    </>
  );
}
