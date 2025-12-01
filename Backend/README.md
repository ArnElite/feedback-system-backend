# Feedback System Backend

Backend API for the blockchain-based anonymous feedback system. This backend connects directly to Ganache blockchain and interacts with the deployed ReviewForum smart contract.

note: if a user registers he doesnt need to login again till, just add the token to the header as a bearer token
## Setup Instructions

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Deploy Smart Contract (Required First)
Make sure you're in the project root directory:
```bash
cd ..
truffle migrate --reset
```

### 3. Start Ganache
- Open Ganache GUI
- Load the `spectacular-church` workspace (or create a new one)
- Make sure it's running on `http://127.0.0.1:7545`

### 4. Start Flask AI Service (Required for profanity check)
```bash
cd BLOCKCHAIN-AI
python app.py
```
Runs on port 5000

### 5. Configure Environment Variables
The `.env` file should have:
```
PORT=3000
GANACHE_URL=http://127.0.0.1:7545
AI_API_URL=http://127.0.0.1:5000
CONTRACT_ADDRESS=
NODE_ENV=development
```

### 6. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`) - Public

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "abc123def456...",
    "user": {
      "id": "1701234567890",
      "email": "user@example.com",
      "accountIndex": 0
    }
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "xyz789abc456...",
    "user": {
      "id": "1701234567890",
      "email": "user@example.com",
      "accountIndex": 0
    }
  }
  ```

### Review Routes (`/api/reviews`)

#### Submit Review (Protected - Requires Authentication)
- **POST** `/api/reviews`
- **Headers:**
  ```
  Authorization: Bearer <your_token_here>
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "message": "This is my anonymous review"
  }
  ```
- **Success Response:**
  ```json
  {
    "success": true,
    "message": "Review submitted successfully",
    "data": {
      "success": true,
      "transactionHash": "0xd8c47d2f3b6d8dcf45162853ffaa6854ba9012ef02c71a6c2b1ea2a5e7b54568",
      "blockNumber": 8,
      "gasUsed": 119114,
      "fromAccount": "0x5758d41fb9ca1a447b44da725d6fcbe0b54636f8",
      "submittedBy": "user@example.com"
    }
  }
  ```
- **Profanity Detected Response:**
  ```json
  {
    "success": false,
    "message": "Your feedback contains inappropriate language. Please revise and try again.",
    "profanityCheck": {
      "detected": true,
      "label": "toxic",
      "score": 0.87
    }
  }
  ```

#### Get All Reviews (Public)
- **GET** `/api/reviews`
- **Response:**
  ```json
  {
    "success": true,
    "count": 5,
    "data": [
      {
        "anonymousId": "0x123abc...",
        "message": "Review text",
        "timestamp": "1701234567",
        "blockNumber": "8"
      }
    ]
  }
  ```

#### Get Review Count (Public)
- **GET** `/api/reviews/count`
- **Response:**
  ```json
  {
    "success": true,
    "count": "5"
  }
  ```

### Health Check
- **GET** `/api/health`
- **Response:**
  ```json
  {
    "status": "OK",
    "message": "Backend is running"
  }
  ```

## Testing with Thunder Client (VS Code Extension)

### Step 1: Register a User
1. Click Thunder Client icon in VS Code sidebar
2. Click "New Request"
3. Set method to **POST**
4. URL: `http://localhost:3000/api/auth/register`
5. Go to "Body" tab
6. Select "JSON"
7. Enter:
   ```json
   {
     "email": "test@example.com",
     "password": "test123"
   }
   ```
8. Click "Send"
9. **Copy the `token` from response** - you'll need it!

### Step 2: Login (Optional - to get new token)
1. New Request
2. Method: **POST**
3. URL: `http://localhost:3000/api/auth/login`
4. Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "test123"
   }
   ```
5. Click "Send"
6. Copy the token

### Step 3: Submit a Review
1. New Request
2. Method: **POST**
3. URL: `http://localhost:3000/api/reviews`
4. Go to "Headers" tab
5. Add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE` (replace YOUR_TOKEN_HERE with actual token)
6. Go to "Body" tab
7. Select "JSON"
8. Enter:
   ```json
   {
     "message": "This is a great feedback system!"
   }
   ```
9. Click "Send"

### Step 4: Get All Reviews
1. New Request
2. Method: **GET**
3. URL: `http://localhost:3000/api/reviews`
4. Click "Send" (no headers or body needed)

### Step 5: Test Profanity Filter
1. Submit review with bad words
2. Should get rejected with profanity error

## Project Structure

```
Backend/
├── controllers/        # Request handlers
│   ├── authController.js     # Login/register logic
│   └── reviewController.js   # Review submission/retrieval
├── routes/            # API routes
│   ├── auth.js              # Auth endpoints
│   └── reviews.js           # Review endpoints
├── services/          # Business logic layer
│   ├── aiService.js         # Profanity check via Flask AI
│   └── blockchainService.js # Web3 & contract interaction
├── models/            # Data models
│   └── userModel.js         # User storage (JSON file)
├── middleware/        # Custom middleware
│   └── authenticate.js      # Token verification
├── data/              # Data storage (auto-generated)
│   └── users.json           # User database
├── server.js          # Entry point
├── .env              # Environment variables
└── package.json      # Dependencies
```

## How It Works

1. **User Registration/Login:**
   - User registers with email/password
   - System assigns them a Ganache account (account[0], account[1], etc.)
   - Returns auth token

2. **Submit Review Flow:**
   - User sends review with auth token
   - Backend verifies token → identifies user
   - Calls Flask AI API to check for profanity
   - If clean → submits to blockchain using user's Ganache account
   - Review stored on-chain with anonymous ID (hashed address)

3. **View Reviews:**
   - Anyone can fetch all reviews from blockchain
   - Reviews show anonymous ID, message, timestamp, block number

## Tech Stack

- **Express.js** - Web framework
- **Web3.js** - Ethereum JavaScript API
- **@truffle/contract** - Contract abstraction
- **Axios** - HTTP client for Flask AI calls
- **Ganache** - Local blockchain
- **Flask** - AI profanity detection service

## User-to-Blockchain Mapping

Each registered user gets assigned a unique Ganache account:
- User 1 (first to register) → Ganache accounts[0]
- User 2 → Ganache accounts[1]
- User 3 → Ganache accounts[2]
- etc.

This ensures each user has their own blockchain identity while maintaining anonymity on-chain.

## Troubleshooting

**Error: Contract artifact not found**
- Run `truffle migrate --reset` from project root

**Error: Cannot connect to Ganache**
- Make sure Ganache is running on port 7545
- Check `GANACHE_URL` in `.env`

**Error: Contract not deployed**
- Make sure you're using the correct Ganache workspace
- Re-deploy with `truffle migrate --reset`

**Error: AI service unavailable**
- Make sure Flask AI is running: `cd BLOCKCHAIN-AI && python app.py`
- Check `AI_API_URL` in `.env`

**Error: Invalid token**
- Token expires on logout or new login
- Register or login again to get new token

**Error: Profanity check fails but review is clean**
- Flask AI service might be down
- Currently configured to allow reviews if AI service fails (fail-open)

