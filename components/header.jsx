import Image from "next/image";
import Link from "next/link";
import HeaderBtn from "./HeaderBtn";

export default function Header({ children }) {
  return (
    <header>
      <nav>
        <div className="nav-wrapper bg-slate-300 flex justify-between items-center py-2">
          <Link href="/" className="px-4">
            <Image src="/logo.svg" alt="logo" width={200} height={200} />
          </Link>
          <ul className="text-lg font-semibold px-4 pt-2 list-disc">
            <li>
              <HeaderBtn href={"/settings"} label={"Settings"} />
            </li>
            <li className="py-2">
              <HeaderBtn href={"/transactions/create"} label={"Create New Transaction"} />
            </li>
            <li className="pb-2">
              <HeaderBtn href={"/transactions/pending"} label={"Pending Transactions"} />
            </li>
            <li className="pb-2">
              <HeaderBtn signIn={true} href={"/api/auth/signin"} label={"Sign In"} />
            </li>
          </ul>
        </div>
      </nav>
      {children}
    </header>
  );
}
