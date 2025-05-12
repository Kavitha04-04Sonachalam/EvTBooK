// Script to verify a user in the UserRegistry contract
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Verifying user with the account:", deployer.address);

  // Get the UserRegistry contract
  const UserRegistry = await ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.attach(
    "0xef7D27f13bFaa171700C8C5a30BA8b010e81DA39" // Replace with your deployed contract address
  );

  // Address to verify (replace with the address you want to verify)
  const addressToVerify = process.env.ADDRESS_TO_VERIFY || deployer.address;
  
  try {
    // Check if the user is registered
    const isRegistered = await userRegistry.isUserRegistered(addressToVerify);
    if (!isRegistered) {
      console.log(`User ${addressToVerify} is not registered. Please register first.`);
      return;
    }

    // Check if the user is already verified
    const isVerified = await userRegistry.isUserVerified(addressToVerify);
    if (isVerified) {
      console.log(`User ${addressToVerify} is already verified.`);
      return;
    }

    // Verify the user
    const tx = await userRegistry.verifyUser(addressToVerify);
    await tx.wait();
    
    console.log(`User ${addressToVerify} has been successfully verified!`);
    
    // Double-check verification status
    const verifiedStatus = await userRegistry.isUserVerified(addressToVerify);
    console.log(`Verification status: ${verifiedStatus}`);
  } catch (error) {
    console.error("Error verifying user:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
