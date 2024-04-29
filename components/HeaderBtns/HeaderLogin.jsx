import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeaderLogin = ({ label, href }) => {
  return (
    <Link href={href}>
      <Button
        className={"bg-blue-500 rounded-xl text-white mx-4"}
      >
        {label}
      </Button>
    </Link>
  );
};

export default HeaderLogin;
