const blockchainService = require('../services/blockchainService');
const aiService = require('../services/aiService');

// @desc    Submit a review to blockchain
// @route   POST /api/reviews
// @access  Private (requires authentication)
exports.submitReview = async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Review message is required'
    });
  }

  try {
    // Check for profanity before submitting to blockchain
    const profanityCheck = await aiService.checkProfanity(message);

    if (profanityCheck.isToxic) {
      return res.status(400).json({
        success: false,
        message: 'Your feedback contains inappropriate language. Please revise and try again.',
        profanityCheck: {
          detected: true,
          label: profanityCheck.label,
          score: profanityCheck.score
        }
      });
    }

    // Submit to blockchain using user's assigned Ganache account
    const result = await blockchainService.submitReview(message, req.user.accountIndex);

    res.status(201).json({
      success: true,
      // message: 'Review submitted successfully',
      data: {
        ...result
        //submittedBy: req.user.email
      }
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error',
      error: error.message
    });
  }
};

// @desc    Get all reviews from blockchain
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const reviews = await blockchainService.getReviews();

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Get review count
// @route   GET /api/reviews/count
// @access  Public
exports.getReviewCount = async (req, res) => {
  try {
    const count = await blockchainService.getReviewCount();

    res.status(200).json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Get review count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review count',
      error: error.message
    });
  }
};
