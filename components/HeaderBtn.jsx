import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const HeaderBtn = ({ href, label, signIn }) => {
  return (
    <Link href={href}>
      <Button className={signIn ? "bg-blue-500 rounded-xl text-white" :
    "bg-slate-500 rounded-xl text-white"}>{label}</Button>
    </Link>
  );
};

export default HeaderBtn;
