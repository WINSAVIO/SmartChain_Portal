# SmartChain Portal - Quick Start Guide

This guide will help you run the local blockchain, backend server, and frontend admin portal for the SmartChain Portal project.

## Prerequisites
- All npm packages are already installed in each directory.
- You have Node.js and npm installed.
- You have MetaMask (optional, for blockchain interaction via browser).

---

## 1. Start the Local Blockchain (Hardhat)
Open a terminal and run:

```bash
cd Backend
npx hardhat node
```

This will start a local blockchain on `http://127.0.0.1:8545`.

---

## 2. Deploy the Smart Contract
In a new terminal window/tab:

```bash
cd Backend
npx hardhat run scripts/deploy.js --network localhost
```

---

## 3. Add Test Data to the Blockchain
In the same terminal:

```bash
npx hardhat run scripts/addTestData.js --network localhost
```

To verify blockchain data:
```bash
npx hardhat run scripts/verifyData.js --network localhost
```

---

## 4. Start the Backend Server
In a new terminal window/tab:

```bash
cd Backend
npm run dev
```

The backend will run on `http://localhost:4000`.

---

## 5. Start the Frontend (Admin Portal)
In a new terminal window/tab:

```bash
cd "Admin Portal"
npm run dev
```

The frontend will run on `http://localhost:3000` (or the next available port).

---

## 6. Access the Application
- Open your browser and go to `http://localhost:3000` to use the Admin Portal.
- You can interact with the blockchain, add/view transactions, and more.

---

## 7. (Optional) View Blockchain Data
To print all blockchain transactions in the terminal:

```bash
cd Backend
npx hardhat run scripts/verifyData.js --network localhost
```

---

## Troubleshooting
- If you see `EADDRINUSE`, the blockchain node is already running.
- If you get a 401 error, log out and log in again in the frontend.
- Make sure all terminals are in the correct directories before running commands.

---

**Enjoy using SmartChain Portal!**
