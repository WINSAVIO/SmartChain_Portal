const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  
  // Attach to the deployed contract
  const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // Updated with the deployed contract address
  const supplyChain = SupplyChain.attach(contractAddress);

  // Get all transactions
  console.log("Fetching transactions from blockchain...");
  const transactions = await supplyChain.getUserTransactions();
  
  console.log("Found transactions:");
  transactions.forEach((tx, index) => {
    console.log(`Transaction ${index + 1}:`);
    console.log(`  Order ID: ${tx.orderId}`);
    console.log(`  Item ID: ${tx.itemId}`);
    console.log(`  Item Name: ${tx.itemName}`);
    console.log(`  Quantity: ${tx.quantity}`);
    console.log(`  Category: ${tx.category}`);
    console.log(`  Status: ${tx.status}`);
    console.log("-------------------");
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 