const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

// Block //
class Block {
  constructor(timestamp, transactions, previousHash = "", smartContractState) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.smartContractState = smartContractState;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        JSON.stringify(this.smartContractState) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
      this.hash = this.calculateHash();
      this.nonce++;
    }
  }

  hasValidTransactions() {
    for (const transaction of this.transactions) {
      if (!transaction.isValid()) {
        return false;
      }
    }
    return true;
  }
}

// Blockchain //
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 0;
    this.pendingTransactions = [];
    this.miningReward = 5;
    this.smartContracts = [];
  }

  getLatestBlock = () => this.chain[this.chain.length - 1];

  createGenesisBlock() {
    const date = new Date(2024, 0, 1);
    const ms = date.getTime();
    return new Block(ms, [], "0");
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

  // Add a new transaction to the list of pending transactions
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

  deploySmartContract(contract) {
    if (contract) {
      this.smartContracts.push(contract);
      return true;
    }
    return false;
  }
}

// Maltcoin Smart Contract //
class MaltContract {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.totalSupply = 100000;
    this.balances = {};
    this.allowance = {};
    this.name = "Maltcoin";
    this.symbol = "MALT";
    this.version = "1.0";
    this.decimals = 0;
  }

  name = () => this.name;
  symbol = () => this.symbol;
  decimals = () => this.decimals;
  totalSupply = () => this.totalSupply;

  initialize(owner) {
    this.owner = owner;
    this.balances[owner] = this.totalSupply;
  }

  /**
   * Mint new coins to a wallet address
   * @param {string} address - the address of the wallet to mint the coins to
   * @param {number} amount - the amount of coins to mint
   * @param {string} timestamp - the timestamp of the minting
   */
  mint(address, amount, timestamp = new Date().getTime()) {
    if (!this.balances[address]) {
      this.balances[address] = 0;
    }
    const tx = new Transaction("0x0", address, amount, 0, timestamp);
    this.blockchain.addTransaction(tx);
    this.totalSupply += amount;
    this.balances[address] += amount;
  }

  /**
   * Burn coins from a wallet address
   * @param {string} address - the address of the wallet to burn the coins from
   * @param {number} amount - the amount of coins to burn
   * @param {string} timestamp - the timestamp of the burning
   */
  burn(address, amount, timestamp = new Date().getTime()) {
    if (this.balanceOf(address) < amount) {
      throw new Error("Insufficient balance");
    }
    const tx = new Transaction(address, "0x0", amount, 0, timestamp);
    this.blockchain.addTransaction(tx);
    this.totalSupply -= amount;
  }

  balanceOf(address) {
    if (!this.balances[address]) {
      throw new Error("Address not found");
    }
    return this.balances[address] || 0;
  }

  transfer(fromAddress, toAddress, amount, fee, privateKey) {
    if (this.balanceOf(fromAddress) < amount) {
      throw new Error("Insufficient balance");
    }
    const tx = new Transaction(
      fromAddress,
      toAddress,
      amount,
      fee,
      new Date().getTime()
    );
    tx.signTransaction(privateKey);

    if (!tx.isValid()) {
      throw new Error("Invalid transaction");
    }

    if (!this.balances[fromAddress]) {
      throw new Error("Address not found");
    }

    this.blockchain.addTransaction(tx);
    this.balances[fromAddress] -= amount + fee;
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
}

// NFT Smart Contract //
class NFTContract {
  constructor(owner) {
    this.owner = owner;
    this.NFTs = ["DN"];
    this.nftOwners = {};
  }

  // TODO: Transfer ownership of an NFT to another address
  transferNFT(tokenId, toAddress) {
    // Check if tokenId exists
    if (!this.NFTs.includes(tokenId)) {
      throw new Error("Token ID does not exist");
    }
    // Check if the sender owns the NFT
    if (this.nftOwners[tokenId] !== msg.sender) {
      throw new Error("Sender does not own the NFT");
    }
    // Transfer ownership to toAddress
    this.nftOwners[tokenId] = toAddress;
  }
}

// Transaction //
class Transaction {
  constructor(fromAddress, toAddress, amount, fee, timestamp) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.fee = fee;
    this.amount = amount;
    this.timestamp = timestamp;
  }

  calculateHash() {
    return SHA256(
      this.fromAddress + this.toAddress + this.amount + this.fee
    ).toString();
  }

  signTransaction(privateKey) {
    const signingKey = ec.keyFromPrivate(privateKey, "hex");
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (this.fromAddress === "0x0") return true; // if the transaction is a mining reward
    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature); // verify the signature
  }
}

// Oracle //
class CBOracle {
  constructor() {
    // this.url = `https://api.currencybeacon.com/v1/latest?api_key=${process.env.NEXT_PUBLIC_CURRENCY_BEACON_API_KEY}`;
  }

  // async getUSDPrice() {
  //   try {
  //     const response = await fetch(this.url);
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching data from Oracle", error);
  //   }
  // }
}

//TODO: updateSmartContract with the latest USD price from the Oracle
// async function updateSmartContract(oracle) {
//   const usdPrice = await oracle.getUSDPrice();
//   if (usdPrice !== null) {
//     // update the smart contract
//   } else {
//     console.log("Error fetching data from Oracle");
//   }
// }
// setInterval(updateSmartContract, 3600000); // update every hour

export { Blockchain, Transaction, CBOracle, NFTContract, MaltContract };
