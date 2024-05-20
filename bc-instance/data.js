import { Blockchain, Transaction, CBOracle, NFTContract } from "./blockchain";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Import Firestore config
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

/* TEST Blockchain instance */
const blockchainInstance = new Blockchain();
blockchainInstance.difficulty = 1;

/* TEST CBOracle */
const cbOracle = new CBOracle();
// cbOracle.getUSDPrice().then((data) => {
//   return data.rates.USD;
// });

const fetchWalletData = async (user) => {
  try {
    const userDocRef = doc(db, "users", user);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData;
    } else {
      console.log("No such document!");
      return null; // Return null if no document is found
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; // Re-throw the error to handle it further up the call stack if necessary
  }
};

// fetch John's, Jane's and Alice's wallet data
const fetchWalletDataForUsers = async () => {
  const johnPromise = fetchWalletData("gPQPF49jHfWx9sSrSa41yt5cLd43");
  const janePromise = fetchWalletData("Jf9qNj5mxQdLZlCC4YPf1YUsxip1");
  const alicePromise = fetchWalletData("XP3qK2yclCTuOvrCFZI64dQQ7RI3");

  const [john, jane, alice] = await Promise.all([
    johnPromise,
    janePromise,
    alicePromise,
  ]);

  return { john, jane, alice };
};

// Use the fetched data
fetchWalletDataForUsers()
  .then(({ john, jane, alice }) => {
    // distribute initial supply
    blockchainInstance.mint(
      john.publicKey,
      1000,
      new Date(2024, 0, 1).getTime()
    );
    blockchainInstance.mint(
      jane.publicKey,
      2000,
      new Date(2024, 0, 1).getTime()
    );
    blockchainInstance.mint(
      alice.publicKey,
      1500,
      new Date(2024, 0, 1).getTime()
    );

    // Create some transactions
    // block 1
    const tx1 = new Transaction(
      john.publicKey,
      jane.publicKey,
      200,
      10,
      new Date(2024, 0, 2).getTime()
    );
    tx1.signTransaction(john.privateKey);
    blockchainInstance.addTransaction(tx1);

    const tx1_2 = new Transaction(
      john.publicKey,
      alice.publicKey,
      50,
      10,
      new Date(2024, 0, 2).getTime()
    );
    tx1_2.signTransaction(john.privateKey);
    blockchainInstance.addTransaction(tx1_2);
    new Date(2024, 10, 10).getTime();
    blockchainInstance.minePendingTransactions(
      john.publicKey,
      new Date(2024, 0, 3).getTime()
    );

    // // block 2
    const tx2 = new Transaction(
      john.publicKey,
      jane.publicKey,
      300,
      10,
      new Date(2024, 0, 4).getTime()
    );
    tx2.signTransaction(john.privateKey);
    blockchainInstance.addTransaction(tx2);

    const tx2_2 = new Transaction(
      john.publicKey,
      alice.publicKey,
      50,
      10,
      new Date(2024, 0, 4).getTime()
    );
    tx2_2.signTransaction(john.privateKey);
    blockchainInstance.addTransaction(tx2_2);

    blockchainInstance.minePendingTransactions(
      jane.publicKey,
      new Date(2024, 0, 5).getTime()
    );

    // // block 3
    const tx3 = new Transaction(
      jane.publicKey,
      alice.publicKey,
      150,
      10,
      new Date(2024, 0, 6).getTime()
    );
    tx3.signTransaction(jane.privateKey);
    blockchainInstance.addTransaction(tx3);
    blockchainInstance.minePendingTransactions(
      alice.publicKey,
      new Date(2024, 0, 7).getTime()
    );

    // // add pending transaction
    const tx4 = new Transaction(
      john.publicKey,
      alice.publicKey,
      150,
      10,
      new Date(2024, 2, 2).getTime()
    );
    tx4.signTransaction(john.privateKey);
    blockchainInstance.addTransaction(tx4);

    // TEST SmartContract instance
    const dnContract = new NFTContract(john.publicKey);

    // deploy smart contract on the blockchain
    blockchainInstance.deploySmartContract(dnContract);
  })
  .catch((error) => {
    console.error("Error fetching wallet data: ", error);
  });

export { blockchainInstance, cbOracle };
