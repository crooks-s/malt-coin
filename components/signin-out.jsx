import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const SignInOut = () => {
  return (
        <Link href="/api/auth/signin">
          <Button className="bg-blue-500 rounded-xl text-white">Sign In</Button>
        </Link>
  )
}

export default SignInOut