Documentation Section: "Submitting a Review Transaction on the Blockchain"
Smart Contract Interaction and Block Creation

To demonstrate the functionality of our blockchain-based anonymous review system, we executed a transaction directly on the local blockchain using the Truffle console.

The following function call was used:

instance.submitReview("This is a demo review", {from: accounts[0]})


This command performs the following actions:

Calls the submitReview() function in the ReviewForum smart contract

Signs the transaction using a Ganache-generated EOA (Externally Owned Account)

Sends the transaction to the Ganache blockchain

Causes Ganache to validate and immediately mine a new block

Stores the review permanently on-chain

Emits a ReviewSubmitted event for indexing and retrieval

✅ Why This Transaction Creates a Block

In a private blockchain environment such as Ganache:

Each state-changing function call
(submitReview() modifies storage)

is treated as a full blockchain transaction.

Ganache acts as the sole validator (similar to a Proof of Authority system), and therefore:
truffle(development)> instance.submitReview("Hello u are bitch", {from: accounts[0]})
{
  tx: '0xd8c47d2f3b6d8dcf45162853ffaa6854ba9012ef02c71a6c2b1ea2a5e7b54568',
  receipt: {
    transactionHash: '0xd8c47d2f3b6d8dcf45162853ffaa6854ba9012ef02c71a6c2b1ea2a5e7b54568',
    transactionIndex: 0,
    blockNumber: 8,
    blockHash: '0x00c76e00a99d8b651838822c1fbb5177ae6c8142f7766612e66f8f86c1f3ee6f',
    from: '0x5758d41fb9ca1a447b44da725d6fcbe0b54636f8',
    to: '0x3453a46b49590d70377884392708bf143602da15',
    cumulativeGasUsed: 119114,
    gasUsed: 119114,
    contractAddress: null,
    logs: [ [Object] ],
    logsBloom: '0x00000000000000000000000000000000080000000000000000002000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000400000000000000000000000000000000000000000000000002000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000010000000000000000000000000',
    status: true,
    effectiveGasPrice: 2894742424,
    type: '0x2',
    rawLogs: [ [Object] ]
  },
  logs: [
    {
      address: '0x3453a46b49590D70377884392708Bf143602dA15',
      blockHash: '0x00c76e00a99d8b651838822c1fbb5177ae6c8142f7766612e66f8f86c1f3ee6f',
      blockNumber: 8,
      logIndex: 0,
      removed: false,
      transactionHash: '0xd8c47d2f3b6d8dcf45162853ffaa6854ba9012ef02c71a6c2b1ea2a5e7b54568',
      transactionIndex: 0,
      id: 'log_b7fe8f6b',
      event: 'ReviewSubmitted',
      args: [Result]
    }
  ]
}
truffle(development)>
Any valid transaction triggers immediate block creation.

✅ Ganache Workspace Requirement

For testing and demonstration, it is essential to use the preset Ganache workspace named:

spectacular-church


This workspace contains:

The correct blockchain state

The deployed smart contract

The predefined accounts

The chain history used during development

Using any other workspace will result in:

❌ missing contract deployment
❌ different chain ID
❌ different accounts
❌ inability to reproduce results

Therefore:

The spectacular-church workspace functions as the main chain for this project and must be loaded before running the demonstration.

STEPS FOR SETUP (FIRST TIME):
on the local directory, open a command prompt and enter the following commands:
1. truffle init (one time)
2. npm i (one time)
3. truffle migrate --reset (compile the smart contracts) (NOT one time)
4. truffle test (test the smart contracts) (NOT one time)
5. truffle console (to enter the truffle developer console to test output)

   After making sure ganache is running (not necessarily the spectacular church workspace, one workspace stores one chain, so if we want to continue we will continue on that chain, for testing u can make new chains every time), next use the following code to test:
   
   let instance = await ReviewForum.deployed()

   then use this to test the function submitReview:

   instance.submitReview("This is a demo review", {from: accounts[0]})

   note that accounts is an array of all accounts presently on ganache at the moment, an account in ganache represents the different students on the network, in this case its the account on the 0th index. This should output the following:

   truffle(development)> instance.submitReview("Hello u are bitch", {from: accounts[0]})
{
  tx: '0xd8c47d2f3b6d8dcf45162853ffaa6854ba9012ef02c71a6c2b1ea2a5e7b54568',
  receipt: {
    transactionHash: '0xd8c47d2f3b6d8dcf45162853ffaa6854ba9012ef02c71a6c2b1ea2a5e7b54568',
    transactionIndex: 0,
    blockNumber: 8,
    blockHash: '0x00c76e00a99d8b651838822c1fbb5177ae6c8142f7766612e66f8f86c1f3ee6f',
    from: '0x5758d41fb9ca1a447b44da725d6fcbe0b54636f8',
    to: '0x3453a46b49590d70377884392708bf143602da15',
    cumulativeGasUsed: 119114,
    gasUsed: 119114,
    contractAddress: null,
    logs: [ [Object] ],
    logsBloom: '0x00000000000000000000000000000000080000000000000000002000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000400000000000000000000000000000000000000000000000002000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000010000000000000000000000000',
    status: true,
    effectiveGasPrice: 2894742424,
    type: '0x2',
    rawLogs: [ [Object] ]
  },
  logs: [
    {
      address: '0x3453a46b49590D70377884392708Bf143602dA15',
      blockHash: '0x00c76e00a99d8b651838822c1fbb5177ae6c8142f7766612e66f8f86c1f3ee6f',
      blockNumber: 8,
      logIndex: 0,
      removed: false,
      transactionHash: '0xd8c47d2f3b6d8dcf45162853ffaa6854ba9012ef02c71a6c2b1ea2a5e7b54568',
      transactionIndex: 0,
      id: 'log_b7fe8f6b',
      event: 'ReviewSubmitted',
      args: [Result]
    }
  ]
}
truffle(development)>

This means the block has successfully been created and the transaction was completed. check ganache GUI to cross verify.

📄 Backend Developer Integration Guide
✅ Overview

The backend will interact with the smart contract deployed on the local Ganache blockchain.

Your responsibilities:

Connect to the existing Ganache workspace (spectacular-church)

Load the deployed ReviewForum contract

Call submitReview() to write data on-chain

Call getReviews() to read data

You do NOT need MetaMask, authentication, or wallet management.

Ganache provides:

accounts

private keys

signing capability

automatic block mining

This an behavior allows us to clearly demonstrate block formation without a public network.
