const ReviewForum = artifacts.require("ReviewForum");

module.exports = function (deployer) {
  deployer.deploy(ReviewForum);
};
