# TicketChain - Decentralized Event Ticketing DApp

A decentralized event ticketing platform built on Ethereum that aims to disrupt the event ticketing industry by minimizing scalping and eliminating counterfeit tickets. Each event ticket is issued as a unique NFT with programmable transfer rules.

## Features

- **NFT Tickets**: Each ticket is a unique NFT that can be easily verified and cannot be duplicated.
- **Anti-Scalping**: Smart contract enforces rules to prevent ticket scalping and unauthorized resales.
- **User Verification**: Only verified users can create events, ensuring legitimacy and trust.
- **Admin Panel**: Admin can verify users and manage platform settings.
- **IPFS Integration**: Event images and ticket metadata are stored on IPFS via Pinata.

## Tech Stack

- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity
- **Development Framework**: Hardhat
- **Frontend**: React with Vite
- **UI Framework**: Material-UI
- **Web3 Integration**: ethers.js
- **IPFS Storage**: Pinata

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH (can be obtained from a faucet)
- Alchemy API key
- Pinata API key and secret
- Etherscan API key (for contract verification)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Configure environment variables

Create a `.env` file in the root directory with the following variables:

```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
PRIVATE_KEY=your-private-key
ETHERSCAN_API_KEY=your-etherscan-api-key
PINATA_API_KEY=your-pinata-api-key
PINATA_API_SECRET=your-pinata-api-secret
```

Update the frontend constants in `frontend/src/utils/constants.js` with your Alchemy and Pinata API keys.

### 4. Compile smart contracts

```bash
npx hardhat compile
```

### 5. Run tests

```bash
npx hardhat test
```

### 6. Deploy smart contracts

```bash
# Deploy to local hardhat network
npx hardhat run scripts/deploy.js

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

### 7. Update frontend with contract addresses

After deployment, update the frontend with the deployed contract addresses:

```bash
node scripts/update-frontend.js <userRegistryAddress> <eventTicketingAddress>
```

### 8. Start the frontend application

```bash
cd frontend
npm run dev
```

## Usage Guide

### User Registration

1. Connect your MetaMask wallet to the application
2. Register as a user by providing your name and email
3. Wait for admin verification to create events

### Creating Events

1. Navigate to the "Create Event" page
2. Fill in the event details (name, description, ticket price, total tickets)
3. Upload an event image
4. Submit the transaction

### Purchasing Tickets

1. Browse available events on the "Events" page
2. Click on an event to view details
3. Click "Purchase Ticket" and confirm the transaction in MetaMask
4. View your purchased tickets in the "My Tickets" section

### Transferring Tickets

1. Go to "My Tickets"
2. Click "Transfer" on the ticket you want to transfer
3. Enter the recipient's Ethereum address
4. Confirm the transaction

### Admin Functions

1. Access the admin panel (only available to the contract owner)
2. Verify users by entering their Ethereum address
3. Revoke verification if necessary

## Smart Contract Architecture

### UserRegistry.sol

Handles user registration and verification:
- Register users with name and email
- Admin verification of users
- Check user registration and verification status

### EventTicketing.sol

Manages events and tickets:
- Create events with details and ticket information
- Purchase tickets as NFTs
- Transfer tickets with anti-scalping rules
- Verify ticket authenticity and ownership

## License

This project is licensed under the MIT License - see the LICENSE file for details.
