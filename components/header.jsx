import Image from "next/image";
import Link from "next/link";

export default function Header({ children }) {
  return (
    <>
      <nav>
        <div className="nav-wrapper bg-slate-300 flex justify-between items-center py-2">
          <Link href="/" className="px-4">
            <Image src="/logo.svg" alt="logo" width={200} height={200} />
          </Link>
          <ul className="text-lg font-semibold px-4 pt-2 list-disc">
            <li>
              <Link href="/settings">Settings</Link>
            </li>
            <li className="py-2">
              <Link href="/transactions/create">Create New Transaction</Link>
            </li>
            <li className="pb-2">
              <Link href="/transactions/pending">Pending Transactions</Link>
            </li>
          </ul>
        </div>
      </nav>
      {children}
    </>
  );
}
