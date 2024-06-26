import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeaderBtn = ({ href, label }) => {
  return (
    <Link href={href}>
      <Button className={"bg-slate-500 rounded-xl text-white mx-4"}>
        {label}
      </Button>
    </Link>
  );
};

export default HeaderBtn;
