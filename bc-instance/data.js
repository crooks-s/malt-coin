import { Blockchain, Transaction } from "./blockchain";
const EC = require("elliptic").ec;
const ec = new EC("secp256k1"); // secp256k1 is the algorithm used in bitcoin

// Generate a key pair, store as object
const walletKeys = [];
const key = ec.genKeyPair();
walletKeys.push({
  keyObj: key,
  publicKey: key.getPublic("hex"),
  privateKey: key.getPrivate("hex"),
});

// Create a blockchain instance
const blockchainInstance = new Blockchain();
blockchainInstance.difficulty = 1;

// Create some transactions
let date = new Date(2024, 0, 2);
let ms = date.getTime();
const tx1 = new Transaction(key.getPublic("hex"), "tx1: wallet_id", 10, ms);
tx1.signTransaction(key);
blockchainInstance.addTransaction(tx1);
blockchainInstance.minePendingTransactions(key.getPublic("hex"));

date = new Date(2024, 0, 3);
ms = date.getTime();
const tx2 = new Transaction(key.getPublic("hex"), "tx2: wallet_id", 20, ms);
tx2.signTransaction(key);
blockchainInstance.addTransaction(tx2);
blockchainInstance.minePendingTransactions(key.getPublic("hex"));

date = new Date(2024, 0, 4);
ms = date.getTime();
const tx3 = new Transaction(key.getPublic("hex"), "tx3: wallet_id", 15, ms);
tx3.signTransaction(key);
blockchainInstance.addTransaction(tx3);
blockchainInstance.minePendingTransactions(key.getPublic("hex"));

export { blockchainInstance, walletKeys };
