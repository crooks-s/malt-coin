"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "/components/ui/table";

const TableWrapper = ({
  selectedBlock,
}) => {
  return (
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
        {selectedBlock.transactions.map((transaction, index) => (
          <TableRow key={index}>
            <TableCell className="w-2 text-center">
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
            <TableCell className="w-2 text-center px-16" >{transaction.amount}</TableCell>
            <TableCell className="w-2 text-center px-16">{transaction.timestamp}</TableCell>
            <TableCell >
              {selectedBlock.hasValidTransactions() ? "yes" : "no"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableWrapper;
