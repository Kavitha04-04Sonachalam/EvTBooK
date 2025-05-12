// Contract addresses - deployed on Sepolia testnet
export const USER_REGISTRY_ADDRESS = "0xef7D27f13bFaa171700C8C5a30BA8b010e81DA39";
export const EVENT_TICKETING_ADDRESS = "0x6fAe78e5e48C2b3d23ec513D1894f2f8d4B248c1";

// Alchemy API key
export const ALCHEMY_API_KEY = "5dY06C4P8OKHeRuug2rU97Erk-dQH2ZV";

// Pinata API keys
export const PINATA_API_KEY = "700b683a4d4e2c0bb469";
export const PINATA_API_SECRET = "a5c964dfa8d5c69cb0146a0bb5203c536497eaffc392993077bea25cbd0691c2";

// Network configuration
export const NETWORK = {
  chainId: "0xaa36a7", // Sepolia testnet
  chainName: "Sepolia",
  rpcUrls: [`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
};
