import {
  Blockchain,
  Transaction,
  CBOracle,
  NFTContract,
  MaltContract,
} from "./blockchain";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Import Firestore config

let blockchainInstance = null;

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

const getBlockchainInstance = async () => {
  if (blockchainInstance) {
    return blockchainInstance;
  }
  blockchainInstance = new Blockchain();
  blockchainInstance.difficulty = 1;

  // Initialize Malt Contract and deploy it on the blockchain
  const maltContract = new MaltContract(blockchainInstance);
  maltContract.initialize(
    "04367c67470c43ee236ea3e919e26085c9dc2beae5199c6f54af11b9e9e896740f7943aeb7e4ed09e4078bccd6aeeaec764dd616b75ff30e25ecbcc5f1a3f2f874"
  );
  blockchainInstance.deploySmartContract(maltContract);

  // Fetch wallet data and distribute initial supply
  const { john, jane, alice } = await fetchWalletDataForUsers();
  if (john && jane && alice) {
    maltContract.mint(john.publicKey, 1000, new Date(2024, 0, 1).getTime());
    maltContract.mint(jane.publicKey, 2000, new Date(2024, 0, 1).getTime());
    maltContract.mint(alice.publicKey, 1500, new Date(2024, 0, 1).getTime());

    // Create transactions and mine blocks
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

    // mine block 1
    blockchainInstance.addTransaction(tx1_2);
    blockchainInstance.minePendingTransactions(
      john.publicKey,
      new Date(2024, 0, 3).getTime()
    );

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

    // mine block 2
    blockchainInstance.minePendingTransactions(
      jane.publicKey,
      new Date(2024, 0, 5).getTime()
    );

    const tx3 = new Transaction(
      jane.publicKey,
      alice.publicKey,
      150,
      10,
      new Date(2024, 0, 6).getTime()
    );
    tx3.signTransaction(jane.privateKey);
    blockchainInstance.addTransaction(tx3);

    // mine block 3
    blockchainInstance.minePendingTransactions(
      alice.publicKey,
      new Date(2024, 0, 7).getTime()
    );

    const tx3_2 = new Transaction(
      john.publicKey,
      alice.publicKey,
      150,
      10,
      new Date(2024, 2, 2).getTime()
    );
    tx3_2.signTransaction(john.privateKey);
    blockchainInstance.addTransaction(tx3_2);

    // Deploy NFTContract
    const dnContract = new NFTContract(john.publicKey);
    blockchainInstance.deploySmartContract(dnContract);
  }

  return blockchainInstance;
};

export { getBlockchainInstance, blockchainInstance, cbOracle };
