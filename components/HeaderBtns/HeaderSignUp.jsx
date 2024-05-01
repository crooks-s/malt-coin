import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeaderSignUp = () => {
  return (
    <Link href={"/signup"}>
      <Button className={"bg-blue-500 rounded-xl text-white mx-4"}>
        Sign Up
      </Button>
    </Link>
  );
};

export default HeaderSignUp;
