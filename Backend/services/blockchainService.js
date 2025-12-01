const Web3 = require('web3');
const contract = require('@truffle/contract');
const path = require('path');
const fs = require('fs');

let web3;
let reviewForumContract;
let accounts;

// Initialize Web3 and connect to Ganache
const initBlockchain = async () => {
  try {
    // Connect to Ganache
    const provider = new Web3.providers.HttpProvider(process.env.GANACHE_URL || 'http://127.0.0.1:7545');
    web3 = new Web3(provider);

    // Get accounts from Ganache
    accounts = await web3.eth.getAccounts();
    console.log(`✅ Connected to Ganache - ${accounts.length} accounts available`);

    // Load contract artifact
    const contractPath = path.join(__dirname, '../../build/contracts/ReviewForum.json');
    
    if (!fs.existsSync(contractPath)) {
      throw new Error('Contract artifact not found. Run "truffle migrate" first.');
    }

    const ReviewForumArtifact = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    
    // Setup contract
    const ReviewForum = contract(ReviewForumArtifact);
    ReviewForum.setProvider(provider);

    // Get deployed instance
    reviewForumContract = await ReviewForum.deployed();
    console.log(`✅ ReviewForum contract loaded at: ${reviewForumContract.address}`);

    return true;
  } catch (error) {
    console.error('❌ Blockchain initialization error:', error.message);
    throw error;
  }
};

// Submit a review to the blockchain
const submitReview = async (message, accountIndex = 0) => {
  try {
    if (!reviewForumContract) {
      throw new Error('Contract not initialized');
    }

    // Use the specific user's Ganache account
    const fromAccount = accounts[accountIndex] || accounts[0];

    // Use first Ganache account to submit review
    const result = await reviewForumContract.submitReview(message, {
      from: fromAccount,
      gas: 500000
    });

    return {
      success: true,
      transactionHash: result.tx,
      blockNumber: result.receipt.blockNumber,
      gasUsed: result.receipt.gasUsed,
      fromAccount: fromAccount
    };
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

// Get all reviews from the blockchain
const getReviews = async () => {
  try {
    if (!reviewForumContract) {
      throw new Error('Contract not initialized');
    }

    const reviews = await reviewForumContract.getReviews();
    
    // Format reviews for response
    return reviews.map(review => ({
      anonymousId: review.anonymousId,
      message: review.message,
      timestamp: review.timestamp.toString(),
      blockNumber: review.blockNumber.toString()
    }));
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
};

// Get review count
const getReviewCount = async () => {
  try {
    if (!reviewForumContract) {
      throw new Error('Contract not initialized');
    }

    const count = await reviewForumContract.getReviewCount();
    return count.toString();
  } catch (error) {
    console.error('Error getting review count:', error);
    throw error;
  }
};

module.exports = {
  initBlockchain,
  submitReview,
  getReviews,
  getReviewCount
};
