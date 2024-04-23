"use client";

import {
  Card,
  CardContent,
  CardHeader
} from "/components/ui/card";

const CardWrapper = ({
  headerLabel,
  hash,
  previousHash,
  nonce,
  timestamp,
  onClick
}) => {
  return (
    <Card className="w-1/3 mx-2 overflow-x-auto flex flex-col justify-between pb-3 mt-4">
      <CardHeader className="text-center font-bold text-lg">{headerLabel}</CardHeader>
      <CardContent className="max-w-xs overflow-hidden break-words ">
        <span className="font-semibold">Hash: </span>{hash}</CardContent>
      <CardContent className="max-w-xs overflow-hidden break-words">
        <span className="font-semibold">Hash of Previous Block: </span> {previousHash}</CardContent>
      <CardContent>
        <span className="font-semibold">Nonce: </span>{nonce}</CardContent>
      <CardContent>
        <span className="font-semibold">Timestamp: </span>{timestamp}</CardContent>
      <button onClick={onClick} className="bg-slate-500 text-white p-2 rounded-md mx-auto">View Transactions</button>
    </Card>
  )
}

export default CardWrapper