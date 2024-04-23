"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableWrapper = ({ transactions }) => {

  const formattedDate = new Date().toLocaleString();

  return (
    <>
    <h1 className="text-2xl font-bold text-center py-5">List of Pending Transactions</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2 pl-3">Transaction</TableHead>
            <TableHead className="w-2 px-16">From Address</TableHead>
            <TableHead className="w-2">To Address</TableHead>
            <TableHead className="w-2 px-16">Amount</TableHead>
            <TableHead className="w-2 px-16">Timestamp</TableHead>
            <TableHead>Valid</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell key={`transaction_${index}`} className="w-2 text-center">
                {index + 1}
              </TableCell>
              <TableCell
                className="max-w-xs overflow-hidden break-words px-16"
              >
                {transaction.fromAddress
                  ? transaction.fromAddress
                  : "System: Mining Reward"}
              </TableCell>
              <TableCell
                className="max-w-xs overflow-hidden break-words"
              >
                {transaction.toAddress}
              </TableCell>
              <TableCell className="w-2 text-center px-16" >
                {transaction.amount}
              </TableCell>
              <TableCell className="w-2 text-center px-16" >
                {formattedDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TableWrapper;
