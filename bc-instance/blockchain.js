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

  // calculate the hash of the transaction
  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  // sign the transaction
  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }

    const hashTx = this.calculateHash(); // hash the transaction
    const sig = signingKey.sign(hashTx, "base64"); // sign the hash
    this.signature = sig.toDER("hex"); // convert the signature to hex
  }

  // check if the transaction is valid
  isValid() {
    if (
      this.fromAddress === null ||
      this.fromAddress === "Initial distribution"
    )
      return true; // if the transaction is a mining reward
    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex"); // get the public key
    return publicKey.verify(this.calculateHash(), this.signature); // verify the signature
  }
}

class Block {
  /**
   * @param {*} timestamp - timestamp of the block creation
   * @param {*} transactions - any data that you want to store in your block
   * @param {*} previousHash - hash of the previous block
   **/
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  // calculate the hash of the block
  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString(); // note: JSON.stringify is used to convert the data object to a string
  }

  // mine the block
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
      this.hash = this.calculateHash();
      this.nonce++;
    }
  }

  // check if all the transactions in the block are valid
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
  constructor() {
    this.name = "Maltcoin";
    this.symbol = "MALT";
    this.decimals = 0;
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 0;
    this.pendingTransactions = [];
    this.miningReward = 5;
    this.totalSupply = 10000;
  }

  name = () => this.name;
  symbol = () => this.symbol;
  decimals = () => this.decimals;
  totalSupply = () => this.totalSupply;

  createGenesisBlock() {
    const date = new Date(2024, 0, 1);
    const ms = date.getTime();
    return new Block(ms, [], "0");
  }

  distributeInitalSupply(address1, address2, address3) {
    const tx1 = new Transaction(
      "Initial distribution",
      address1,
      1000,
      new Date(2024, 0, 1).getTime()
    );
    this.pendingTransactions.push(tx1);
    const tx2 = new Transaction(
      "Initial distribution",
      address2,
      2000,
      new Date(2024, 0, 1).getTime()
    );
    this.pendingTransactions.push(tx2);
    const tx3 = new Transaction(
      "Initial distribution",
      address3,
      1500,
      new Date(2024, 0, 1).getTime()
    );
    this.pendingTransactions.push(tx3);
    this.totalSupply -= 4500;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(
    miningRewardAddress,
    timestamp = new Date().getTime()
  ) {
    let block = new Block(
      timestamp,
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);
    this.chain.push(block);

    // pend the mining reward for the next miner
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward, timestamp),
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
    // Iterate over each block in the blockchain
    for (const block of this.chain) {
      // Iterate over each transaction in the block
      for (const transaction of block.transactions) {
        // If the transaction is from the target address, subtract the amount
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }
        // If the transaction is to the target address, add the amount
        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }
    for (const transaction of this.pendingTransactions) {
      if (transaction.fromAddress === address) {
        balance -= transaction.amount;
        // if (transaction.toAddress === address) {
        //   balance += transaction.amount;
        // }
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

export { Blockchain, Transaction };
