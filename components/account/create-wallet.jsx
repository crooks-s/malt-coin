import { CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseConfig";

export function CreateWallet() {
  const [publicKey, setPublicKey] = useState("PUBLIC_KEY");
  const [privateKey, setPrivateKey] = useState("PRIVATE_KEY");
  const [isOpen, setIsOpen] = useState(false);

  const generateWallet = async () => {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic("hex");
    const privateKey = key.getPrivate("hex");
    setPublicKey(publicKey);
    setPrivateKey(privateKey);

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        publicKey: publicKey,
        privateKey: privateKey,
      });
      // Close the dialog after successful submission
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Wallet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Wallet</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="public" value={publicKey} readOnly />
            <Input id="private" value={privateKey} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={generateWallet} type="button" variant="secondary">
            Generate new wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
