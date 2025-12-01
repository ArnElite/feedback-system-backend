const axios = require('axios');

// Check text for profanity using Flask AI API
const checkProfanity = async (text) => {
  try {
    const aiApiUrl = process.env.AI_API_URL || 'http://127.0.0.1:5000';
    
    const response = await axios.post(`${aiApiUrl}/api/check`, {
      text: text
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000 // 5 second timeout
    });

    return {
      isToxic: response.data.is_toxic || false,
      label: response.data.label || '',
      score: response.data.score || 0.0
    };
  } catch (error) {
    console.error('Error calling AI API:', error.message);
    // If AI service is down, allow the review (fail open)
    // Or you can fail closed by returning { isToxic: true }
    return {
      isToxic: false,
      label: 'error',
      score: 0.0,
      error: error.message
    };
  }
};

module.exports = {
  checkProfanity
};
