const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticate = require('../middleware/authenticate');

// @route   POST /api/reviews
// @desc    Submit a review to blockchain
// @access  Private (requires authentication)
router.post('/', authenticate, reviewController.submitReview);

// @route   GET /api/reviews
// @desc    Get all reviews from blockchain
// @access  Public
router.get('/', reviewController.getReviews);

// @route   GET /api/reviews/count
// @desc    Get review count
// @access  Public
router.get('/count', reviewController.getReviewCount);

module.exports = router;
