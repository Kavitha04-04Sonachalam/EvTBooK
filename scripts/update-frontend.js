const fs = require('fs');
const path = require('path');

async function main() {
  const [userRegistryAddress, eventTicketingAddress] = process.argv.slice(2);
  
  if (!userRegistryAddress || !eventTicketingAddress) {
    console.error('Please provide both contract addresses as arguments:');
    console.error('node scripts/update-frontend.js <userRegistryAddress> <eventTicketingAddress>');
    process.exit(1);
  }

  const constantsPath = path.join(__dirname, '../frontend/src/utils/constants.js');
  
  try {
    let content = fs.readFileSync(constantsPath, 'utf8');
    
    // Update UserRegistry address
    content = content.replace(
      /export const USER_REGISTRY_ADDRESS = "0x[a-fA-F0-9]{40}";/,
      `export const USER_REGISTRY_ADDRESS = "${userRegistryAddress}";`
    );
    
    // Update EventTicketing address
    content = content.replace(
      /export const EVENT_TICKETING_ADDRESS = "0x[a-fA-F0-9]{40}";/,
      `export const EVENT_TICKETING_ADDRESS = "${eventTicketingAddress}";`
    );
    
    fs.writeFileSync(constantsPath, content);
    
    console.log('Frontend constants updated successfully!');
    console.log(`UserRegistry: ${userRegistryAddress}`);
    console.log(`EventTicketing: ${eventTicketingAddress}`);
  } catch (error) {
    console.error('Error updating frontend constants:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
