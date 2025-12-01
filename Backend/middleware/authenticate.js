const userModel = require('../models/userModel');

// Middleware to verify user token and attach user to request
const authenticate = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Please login.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = userModel.findUserByToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.'
      });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      accountIndex: user.accountIndex
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = authenticate;
