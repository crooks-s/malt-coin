import { Blockchain, Transaction } from "./blockchain";
const EC = require("elliptic").ec;
const ec = new EC("secp256k1"); // secp256k1 is the algorithm used in bitcoin

/* TEST BLOCKCHAIN INSTANCE */
const blockchainInstance = new Blockchain();
blockchainInstance.difficulty = 1;

/* TEST USER DATA */
const johnsKey = ec.genKeyPair();
const janesKey = ec.genKeyPair();
const alicesKey = ec.genKeyPair();
// publicKey: key.getPublic("hex")
// privateKey: key.getPrivate("hex")

const users = [
  {
    id: 1,
    username: "john_doe",
    password: "password",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    age: 30,
    maltBalance: 0,
    keyObj: johnsKey,
    publicKey: johnsKey.getPublic("hex"),
    privateKey: johnsKey.getPrivate("hex"),
    isAdmin: false,
  },
  {
    id: 2,
    username: "jane_smith",
    password: "password",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Smith",
    age: 25,
    maltBalance: 0,
    keyObj: janesKey,
    publicKey: janesKey.getPublic("hex"),
    privateKey: janesKey.getPrivate("hex"),
    isAdmin: true,
  },
  {
    id: 3,
    username: "alice_wonderland",
    password: "password",
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Wonderland",
    age: 28,
    maltBalance: 0,
    keyObj: alicesKey,
    publicKey: alicesKey.getPublic("hex"),
    privateKey: alicesKey.getPrivate("hex"),
    isAdmin: false,
  },
];

// distribute initial supply
blockchainInstance.distributeInitalSupply(
  users[0].publicKey,
  users[1].publicKey,
  users[2].publicKey
);

// Create some transactions
// block 1
let date = new Date(2024, 0, 2);
let ms = date.getTime();
const tx1 = new Transaction(users[0].publicKey, users[1].publicKey, 200, ms);
tx1.signTransaction(users[0].keyObj);
blockchainInstance.addTransaction(tx1);
const tx1_2 = new Transaction(users[0].publicKey, users[2].publicKey, 50, ms);
tx1_2.signTransaction(users[0].keyObj);
blockchainInstance.addTransaction(tx1_2);
blockchainInstance.minePendingTransactions(users[0].publicKey);

// block 2
date = new Date(2024, 0, 3);
ms = date.getTime();
const tx2 = new Transaction(users[0].publicKey, users[1].publicKey, 300, ms);
tx2.signTransaction(users[0].keyObj);
blockchainInstance.addTransaction(tx2);
const tx2_2 = new Transaction(users[0].publicKey, users[2].publicKey, 50, ms);
tx2_2.signTransaction(users[0].keyObj);
blockchainInstance.addTransaction(tx2_2);
blockchainInstance.minePendingTransactions(users[1].publicKey);

// block 3
date = new Date(2024, 0, 4);
ms = date.getTime();
const tx3 = new Transaction(users[1].publicKey, users[2].publicKey, 150, ms);
tx3.signTransaction(users[1].keyObj);
blockchainInstance.addTransaction(tx3);
blockchainInstance.minePendingTransactions(users[2].publicKey);

export { blockchainInstance };
export default users;
