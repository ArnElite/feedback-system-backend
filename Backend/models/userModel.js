const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, '../data/users.json');

// Initialize data file if it doesn't exist
const initDataFile = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], nextAccountIndex: 0 }, null, 2));
  }
};

// Read data from file
const readData = () => {
  initDataFile();
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

// Write data to file
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Generate simple token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Find user by email
const findUserByEmail = (email) => {
  const data = readData();
  return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Find user by token
const findUserByToken = (token) => {
  const data = readData();
  return data.users.find(u => u.token === token);
};

// Create new user
const createUser = (email, password) => {
  const data = readData();
  
  // Check if user exists
  if (findUserByEmail(email)) {
    throw new Error('Email already registered');
  }

  // Assign next available Ganache account
  const accountIndex = data.nextAccountIndex;
  const token = generateToken();

  const newUser = {
    id: Date.now().toString(),
    email,
    password, // Plain text for demo only
    accountIndex, // Which Ganache account this user uses
    token,
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  data.nextAccountIndex += 1;
  writeData(data);

  return {
    id: newUser.id,
    email: newUser.email,
    accountIndex: newUser.accountIndex,
    token: newUser.token
  };
};

// Login user
const loginUser = (email, password) => {
  const user = findUserByEmail(email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (user.password !== password) {
    throw new Error('Invalid credentials');
  }

  // Generate new token on each login
  const data = readData();
  const userIndex = data.users.findIndex(u => u.email === email);
  const newToken = generateToken();
  data.users[userIndex].token = newToken;
  writeData(data);

  return {
    id: user.id,
    email: user.email,
    accountIndex: user.accountIndex,
    token: newToken
  };
};

module.exports = {
  findUserByEmail,
  findUserByToken,
  createUser,
  loginUser
};
