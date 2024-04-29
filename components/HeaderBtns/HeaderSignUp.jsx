import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeaderSignUp = () => {
  return (
    <Link href={"/signup"}
      className={"bg-blue-500 rounded-xl text-white mx-4"} >
      <Button>Sign Up</Button>
    </Link>
  );
};

export default HeaderSignUp;
