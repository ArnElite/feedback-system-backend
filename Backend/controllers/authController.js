const userModel = require('../models/userModel');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  if (password.length < 4) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 4 characters'
    });
  }

  try {
    const user = userModel.createUser(email, password);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: user.token,
      user: {
        id: user.id,
        email: user.email,
        accountIndex: user.accountIndex
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  try {
    const user = userModel.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: user.token,
      user: {
        id: user.id,
        email: user.email,
        accountIndex: user.accountIndex
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};
