const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1"); // secp256k1 is the algorithm used in bitcoin

class Transaction {
  constructor(fromAddress, toAddress, amount, timestamp) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = timestamp;
  }

  // Function to calculate the hash of the transaction
  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  // Function to sign the transaction
  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }

    const hashTx = this.calculateHash(); // hash the transaction
    const sig = signingKey.sign(hashTx, "base64"); // sign the hash
    this.signature = sig.toDER("hex"); // convert the signature to hex
  }

  // Function to check if the transaction is valid
  isValid() {
    if (this.fromAddress === null) return true; // if the transaction is a mining reward
    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex"); // get the public key
    return publicKey.verify(this.calculateHash(), this.signature); // verify the signature
  }
}

class Block {
  /**
   *
   * @param {*} timestamp - timestamp of the block creation
   * @param {*} data - any data that you want to store in your block
   * @param {*} previousHash - hash of the previous block
   */
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  // Function to calculate the hash of the block
  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString(); // note: JSON.stringify is used to convert the data object to a string
  }

  // Function to mine the block
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
      this.hash = this.calculateHash();
      this.nonce++;
    }

    // console.log("Block mined: " + this.hash);
  }

  // Function to check if all the transactions in the block are valid
  hasValidTransactions() {
    for (const transaction of this.transactions) {
      if (!transaction.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class Blockchain {
  // initializes the blockchain
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 0;
    this.pendingTransactions = [];
    this.miningReward = 5;
  }
  createGenesisBlock() {
    const date = new Date(2024, 0, 1);
    const ms = date.getTime();
    return new Block(ms, 0, "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const date = new Date(2024, 2, 1);
    const ms = date.getTime();
    let block = new Block(
      ms,
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    // console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [
      // give the mining reward to the miner
      new Transaction(null, miningRewardAddress, this.miningReward, ms),
    ];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }

    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }

    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) {
          // if the address is the sender
          balance -= transaction.amount;
        }
        if (transaction.toAddress === address) {
          // if the address is the receiver
          balance += transaction.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
