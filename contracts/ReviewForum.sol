// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReviewForum {

    struct Review {
        bytes32 anonymousId;   // hashed wallet address for anonymity
        string message;        // review text
        uint256 timestamp;     // when the review was posted
        uint256 blockNumber;   // block where the review was recorded
    }

    Review[] public reviews;   // dynamic array storing all reviews

    event ReviewSubmitted(
        bytes32 indexed anonymousId,
        string message,
        uint256 timestamp,
        uint256 blockNumber
    );

    // Main function: stores the review and triggers a blockchain transaction
    function submitReview(string calldata _message) external {
        // Create anonymous reviewer identity
        bytes32 anonId = keccak256(abi.encodePacked(msg.sender));

        // Store review on-chain
        reviews.push(
            Review(
                anonId,
                _message,
                block.timestamp,
                block.number
            )
        );

        // Emit event for frontend listening
        emit ReviewSubmitted(
            anonId,
            _message,
            block.timestamp,
            block.number
        );

        // NOTE:
        // Calling this function creates a transaction,
        // which forces Ganache to mine a new block automatically.
    }

    // Getter to fetch all reviews
    function getReviews() external view returns (Review[] memory) {
        return reviews;
    }

    // Optional: returns number of reviews
    function getReviewCount() external view returns (uint256) {
        return reviews.length;
    }
}
