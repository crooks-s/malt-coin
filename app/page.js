"use client";
import { useState, useEffect, Suspense } from "react";
import {
  blockchainInstance,
  getBlockchainInstance,
  cbOracle,
} from "@/bc-instance/data";

import CardWrapper from "@/components/card-wrapper";
import TableWrapper from "@/components/table-wrapper";
import Header from "@/components/header";
import Footer from "@/components/footer";
import NonSSRWrapper from "@/components/NonSSRWrapper";

export default function Home() {
  const [blockchain, setBlockchain] = useState(null);
  const [blockNum, setBlockNum] = useState(0); // default to genesis block
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // const ethRate = cbOracle.getUSDPrice().then((data) => {
  //   return data.rates.ETH;
  // });
  // const base = cbOracle.getUSDPrice().then((data) => {
  //   return data.rates.USD;
  // });

  useEffect(() => {
    const fetchData = async () => {
      const instance = await getBlockchainInstance();
      setBlockchain(instance);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    if (blockchain) {
      setSelectedBlock(blockchain.chain[blockNum]);
    }
  }, [blockchain, blockNum]);

  return (
    <NonSSRWrapper>
      <Header />
        {isLoading ? ( // Render loading state
          <div>Loading...</div>
        ) : (
          <>
            <h1 className="px-4 text-xl font-semibold pt-10 text-center">
              Blocks on Chain
            </h1>
            <h2 className="text-center text-lg">
              Current Height: {blockchain ? blockchain.chain.length : null}
            </h2>
            <h2 className="text-center text-lg">
              Total Supply of MALT: {blockchain ? blockchain.totalSupply : null}
            </h2>
            <h2 className="text-center text-lg">
              Current ETH Price on Currency Beacon:
              {/* {ethRate} tokens */} **
            </h2>
            <h2 className="text-center text-lg">
              Reference/BASE:
              {/* ${base} USD */} **
            </h2>
            <div className="flex w-full justify-center flex-wrap my-10 px-2">
              {blockchain 
                ? blockchain.chain.map((block, index) => (
                    <CardWrapper
                      key={index}
                      headerLabel={`Block #${
                        index === 0 ? "0 - Genesis" : index
                      }`}
                      hash={block.hash}
                      previousHash={block.previousHash}
                      nonce={block.nonce}
                      timestamp={block.timestamp}
                      onClick={() => setBlockNum(index)}
                    />
                  ))
                : null}
            </div>

            {/* List of transactions */}
            <h1 className="px-4 text-xl font-semibold pt-10 pb-5 text-center">
              List of Transactions in Block #{blockNum}
            </h1>
            <div className="mb-20">
              {blockchain &&
              selectedBlock &&
              selectedBlock.transactions.length > 0 ? (
                <TableWrapper selectedBlock={selectedBlock} />
              ) : (
                <p className="text-center mb-20">
                  No transactions in this block
                </p>
              )}
            </div>
          </>
        )}
      <Footer />
    </NonSSRWrapper>
  );
}
