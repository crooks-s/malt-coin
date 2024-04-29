"use client";

import Image from "next/image";
import Link from "next/link";
import HeaderBtn from "./HeaderBtns/HeaderBtn";
import { useLoginStore } from "@/store";
import HeaderLogin from "./HeaderBtns/HeaderLogin";
import HeaderGoogleLogin from "./HeaderBtns/HeaderGoogleLogin";
import HeaderLogout from "./HeaderBtns/HeaderLogout";

export default function Header({ children }) {
  return (
    <header>
      <nav>
        <div className="nav-wrapper bg-slate-300 flex flex-wrap justify-center items-center py-2 px-3">
          <Link href="/" className="px-4">
            <Image src="/logo.svg" alt="logo" width={200} height={200} />
          </Link>
          <HeaderBtn
            href={"/transactions/create"}
            label={"Create New Transaction"}
          />
          <HeaderBtn
            href={"/transactions/pending"}
            label={"Pending Transactions"}
          />
          <HeaderBtn href={"/settings"} label={"Settings"} />

          {!useLoginStore((state) => state.isLoggedIn) ? (
            <>
              <HeaderGoogleLogin />
              <HeaderLogin href={"/login"} label={"Login"} />
            </>
          ) : (
            <HeaderLogout />
          )}
        </div>
      </nav>
      {children}
    </header>
  );
}
