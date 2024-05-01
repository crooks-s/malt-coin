const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1"); // secp256k1 is the algorithm used in bitcoin

class SmartContract {
  constructor(owner) {
    this.owner = owner;
    this.methods = {};
    this.NFTs = ["DN"];
  }
}

class Transaction {
  /**
   *
   * @param {string} fromAddress - the wallet address of the sender
   * @param {string} toAddress - the wallet address of the receiver
   * @param {number} amount - the amount to be sent
   * @param {number} fee - the fee to be paid
   * @param {string} timestamp - the timestamp of the transaction
   */
  constructor(fromAddress, toAddress, amount, fee, timestamp) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.fee = fee;
    this.amount = amount;
    this.timestamp = timestamp;
  }

  // calculate the hash of the transaction
  calculateHash() {
    return SHA256(
      this.fromAddress + this.toAddress + this.amount + this.fee
    ).toString();
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
    if (this.fromAddress === "0x0") return true; // if the transaction is a mining reward
    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction"); // return false
    }
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex"); // get the public key
    return publicKey.verify(this.calculateHash(), this.signature); // verify the signature
  }
}

class Block {
  /**
   * @param {string} timestamp - timestamp of the block creation
   * @param {currently set to number but should be object} transactions - any data that you want to store in your block
   * @param {string} previousHash - hash of the previous block
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
      this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
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
    this.version = "1.0";
    this.decimals = 0;
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 0;
    this.pendingTransactions = [];
    this.miningReward = 5;
    this.totalSupply = 0;
    this.SmartContracts = [];
  }

  name = () => this.name;
  symbol = () => this.symbol;
  decimals = () => this.decimals;
  totalSupply = () => this.totalSupply;
  getLatestBlock = () => this.chain[this.chain.length - 1];

  createGenesisBlock() {
    const date = new Date(2024, 0, 1);
    const ms = date.getTime();
    return new Block(ms, [], "0");
  }

  /**
   *
   * @param {string} address - the address of the wallet to mint the coins to
   * @param {number} amount - the amount of coins to mint
   * @param {string} timestamp - the timestamp of the minting
   */
  mint(address, amount, timestamp = new Date().getTime()) {
    const tx = new Transaction("0x0", address, amount, 0, timestamp);
    this.pendingTransactions.push(tx);
    this.totalSupply += amount;
  }

  /**
   *
   * @param {string} address - the address of the wallet to burn the coins from
   * @param {number} amount - the amount of coins to burn
   * @param {string} timestamp - the timestamp of the burning
   */
  burn(address, amount, timestamp = new Date().getTime()) {
    if (this.balanceOf(address) < amount) {
      throw new Error("Insufficient balance");
    }
    const tx = new Transaction(address, "0x0", amount, 0, timestamp);
    this.pendingTransactions.push(tx);
    this.totalSupply -= amount;
  }

  /**
   * Approve a spender to spend tokens on behalf of the token holder
   * @param {string} spenderAddress - The address of the spender
   * @param {number} amount - The amount of tokens to approve
   * @param {string} ownerAddress - The address of the token holder
   */
  approve(spenderAddress, amount, ownerAddress) {
    // Perform checks
    if (!ownerAddress || !spenderAddress || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid parameters for approval");
    }

    // TODO: Find the token holder's account and update allowance
    // const accountIndex = this.accounts.findIndex(
    //   (account) => account.address === ownerAddress
    // );
    // if (accountIndex === -1) {
    //   throw new Error("Token holder account not found");
    // }
    // this.accounts[accountIndex].allowance[spenderAddress] = amount;
  }

  /**
   *
   * @param {string} miningRewardAddress - the address of the wallet to receive the mining reward
   * @param {string} timestamp - the timestamp of the mining
   */
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

    // pend the mining transaction including fees allocated to the miner
    let totalFees = 0;
    for (const transaction of this.pendingTransactions) {
      totalFees += transaction.fee;
    }
    this.pendingTransactions = [
      new Transaction(
        "0x0",
        miningRewardAddress,
        this.miningReward + totalFees,
        0,
        timestamp
      ),
    ];
  }

  /**
   *
   * @param {object} transaction - the transaction to be added to the blockchain
   */
  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }
    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }
    this.pendingTransactions.push(transaction);
  }

  balanceOf(address) {
    let balance = 0;
    // Iterate over each block in the blockchain
    for (const block of this.chain) {
      // Iterate over each transaction in the block
      for (const transaction of block.transactions) {
        // If the transaction is from the target address, subtract the amount and fee
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
          balance -= transaction.fee;
        }
        // If the transaction is to the target address, add the amount
        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }
    // Deduct pending transactions from the balance
    for (const transaction of this.pendingTransactions) {
      if (transaction.fromAddress === address) {
        balance -= transaction.fee;
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

  deploySmartContract(owner) {
    const contract = new SmartContract(owner);
    if (contract) {
      this.SmartContracts.push(contract);
      return true;
    }
    return false;
  }
}

export { Blockchain, Transaction };
