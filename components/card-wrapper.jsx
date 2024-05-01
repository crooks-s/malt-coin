"use client";

import { Card, CardContent, CardHeader } from "/components/ui/card";
import { Button } from "/components/ui/button";

const CardWrapper = ({
  headerLabel,
  hash,
  previousHash,
  nonce,
  timestamp,
  onClick,
}) => {
  const formattedDate = new Date(timestamp).toLocaleString();

  return (
    <Card className="w-1/3 mx-2 overflow-x-auto flex flex-col justify-between pb-3 mt-4">
      <CardHeader className="text-center font-bold text-lg">
        {headerLabel}
      </CardHeader>
      <CardContent className="max-w-xs overflow-hidden break-words ">
        <span className="font-semibold">Hash: </span>
        {hash}
      </CardContent>
      <CardContent className="max-w-xs overflow-hidden break-words">
        <span className="font-semibold">Hash of Previous Block: </span>{" "}
        {previousHash}
      </CardContent>
      <CardContent>
        <span className="font-semibold">Nonce: </span>
        {nonce}
      </CardContent>
      <CardContent>
        <span className="font-semibold">Timestamp: </span>
        {formattedDate}
      </CardContent>
      <Button
        onClick={onClick}
        className="bg-slate-500 text-white p-3 mx-auto mb-5 rounded-xl"
      >
        View Transactions
      </Button>
    </Card>
  );
};

export default CardWrapper;
