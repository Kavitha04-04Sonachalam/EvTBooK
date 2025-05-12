// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy UserRegistry contract
  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy();
  await userRegistry.deploymentTransaction().wait();

  console.log(`UserRegistry deployed to: ${userRegistry.target}`);

  // Deploy EventTicketing contract with UserRegistry address
  const EventTicketing = await hre.ethers.getContractFactory("EventTicketing");
  const eventTicketing = await EventTicketing.deploy(userRegistry.target);
  await eventTicketing.deploymentTransaction().wait();

  console.log(`EventTicketing deployed to: ${eventTicketing.target}`);

  console.log("Deployment completed successfully!");

  // For easier verification on Etherscan
  console.log("Verify with:");
  console.log(`npx hardhat verify --network sepolia ${userRegistry.target}`);
  console.log(`npx hardhat verify --network sepolia ${eventTicketing.target} ${userRegistry.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
