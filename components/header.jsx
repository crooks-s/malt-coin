import Image from "next/image";
import Link from "next/link";
import HeaderBtn from "./HeaderBtn";

export default function Header({ children }) {
  return (
    <header>
      <nav>
        <div className="nav-wrapper bg-slate-300 flex flex-wrap justify-center items-center py-2 px-3">
          <Link href="/" className="px-4">
            <Image src="/logo.svg" alt="logo" width={200} height={200} />
          </Link>

              <HeaderBtn 
              href={"/settings"} 
              label={"Settings"} />


              <HeaderBtn
                href={"/transactions/create"}
                label={"Create New Transaction"}
              />


              <HeaderBtn
                href={"/transactions/pending"}
                label={"Pending Transactions"}
              />


              <HeaderBtn
                signIn={true}
                href={"/api/auth/signin"}
                label={"Sign In with Google"}
              />

            <HeaderBtn
                signIn={true}
                href={"/login"}
                label={"Login"}
              />

        </div>
      </nav>
      {children}
    </header>
  );
}
