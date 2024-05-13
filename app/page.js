"use client";
import { useState, useEffect } from "react";
import { blockchainInstance, cbOracle } from "@/bc-instance/data";

import CardWrapper from "@/components/card-wrapper";
import TableWrapper from "@/components/table-wrapper";
import Header from "@/components/header";
import Footer from "@/components/footer";
import NonSSRWrapper from "@/components/NonSSRWrapper";

export default function Home() {
  const [blockNum, setBlockNum] = useState(0); // block number
  const selectedBlock = blockchainInstance.chain[blockNum]; // selected block using block number

  // const ethRate = cbOracle.getUSDPrice().then((data) => {
  //   return data.rates.ETH;
  // });
  // const base = cbOracle.getUSDPrice().then((data) => {
  //   return data.rates.USD;
  // });

  return (
    <NonSSRWrapper>
      <Header />
      <h1 className="px-4 text-xl font-semibold pt-10 text-center">
        Blocks on Chain
      </h1>
      <h2 className="text-center text-lg">
        Current Height: {blockchainInstance.chain.length}
      </h2>
      <h2 className="text-center text-lg">
        Total Supply of MALT: {blockchainInstance.totalSupply}
      </h2>
      <h2 className="text-center text-lg">
        Current ETH Price on Currency Beacon:
        {/* {ethRate} tokens */} **commented out
      </h2>
      <h2 className="text-center text-lg">
        BASE:
        {/* ${base} USD */} **commented out
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

      {/* List of transactions */}
      <h1 className="px-4 text-xl font-semibold pt-10 pb-5 text-center">
        List of Transactions in Block #{blockNum}
      </h1>
      <div className="mb-20">
        {selectedBlock.transactions.length > 0 ? (
          <TableWrapper selectedBlock={selectedBlock} />
        ) : (
          <p className="text-center mb-20">No transactions in this block</p>
        )}
      </div>

      <Footer />
    </NonSSRWrapper>
  );
}
