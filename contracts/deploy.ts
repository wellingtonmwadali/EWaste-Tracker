import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying EWasteTracker to Polygon Mumbai...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC");

  // Deploy contract
  const EWasteTracker = await ethers.getContractFactory("EWasteTracker");
  const contract = await EWasteTracker.deploy();
  
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  
  console.log("✅ EWasteTracker deployed to:", contractAddress);
  console.log("📋 Save this address for your backend .env file");
  console.log("\n🔍 Verify on PolygonScan Mumbai:");
  console.log(`https://mumbai.polygonscan.com/address/${contractAddress}`);
  
  // Test basic functionality
  console.log("\n🧪 Testing contract...");
  const tx = await contract.registerDevice("Laptop");
  await tx.wait();
  console.log("✅ Test device registered successfully");
  
  const deviceCount = await contract.getTotalDevices();
  console.log("📊 Total devices:", deviceCount.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
