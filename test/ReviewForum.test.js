const ReviewForum = artifacts.require("ReviewForum");

contract("ReviewForum", (accounts) => {

    let contractInstance;

    before(async () => {
        contractInstance = await ReviewForum.new();
    });

    it("should deploy successfully", async () => {
        assert(contractInstance.address !== "");
    });

    it("should allow a user to submit a review", async () => {
        const message = "This is a test review";
        const tx = await contractInstance.submitReview(message, { from: accounts[0] });

        // check event
        const event = tx.logs[0].args;
        assert(event.message === message, "Message mismatch in event");
    });

    it("should store the review on-chain", async () => {
        const reviews = await contractInstance.getReviews();
        assert(reviews.length > 0, "Review array should not be empty");
    });

    it("should hash the sender address for anonymity", async () => {
        const reviews = await contractInstance.getReviews();
        const anonId = reviews[0].anonymousId;

        const expectedHash = web3.utils.keccak256(accounts[0]);

        assert(
            anonId === expectedHash,
            "Anonymous hash does not match keccak256(msg.sender)"
        );
    });

    it("should store the block number and timestamp", async () => {
        const reviews = await contractInstance.getReviews();
        const review = reviews[0];

        assert(Number(review.timestamp) > 0, "Timestamp not stored");
        assert(Number(review.blockNumber) > 0, "Block number not stored");
    });

    it("should increase the review count", async () => {
        const countBefore = await contractInstance.getReviewCount();
        await contractInstance.submitReview("Another test", { from: accounts[1] });
        const countAfter = await contractInstance.getReviewCount();

        assert(
            countAfter.toNumber() === countBefore.toNumber() + 1,
            "Review count did not increment"
        );
    });

});
