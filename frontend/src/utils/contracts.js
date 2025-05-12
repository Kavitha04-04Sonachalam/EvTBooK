import { ethers } from "ethers";
import { USER_REGISTRY_ADDRESS, EVENT_TICKETING_ADDRESS } from "./constants";

// Import ABI files
import UserRegistryABI from "../../../artifacts/contracts/UserRegistry.sol/UserRegistry.json";
import EventTicketingABI from "../../../artifacts/contracts/EventTicketing.sol/EventTicketing.json";

// Get provider
export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

// Get signer
export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

// Get UserRegistry contract
export const getUserRegistryContract = async (signer = null) => {
  if (!signer) {
    signer = await getSigner();
  }
  
  return new ethers.Contract(
    USER_REGISTRY_ADDRESS,
    UserRegistryABI.abi,
    signer
  );
};

// Get EventTicketing contract
export const getEventTicketingContract = async (signer = null) => {
  if (!signer) {
    signer = await getSigner();
  }
  
  return new ethers.Contract(
    EVENT_TICKETING_ADDRESS,
    EventTicketingABI.abi,
    signer
  );
};

// Check if user is registered
export const isUserRegistered = async (address) => {
  const contract = await getUserRegistryContract();
  return await contract.isUserRegistered(address);
};

// Check if user is verified
export const isUserVerified = async (address) => {
  const contract = await getUserRegistryContract();
  return await contract.isUserVerified(address);
};

// Register user
export const registerUser = async (name, email) => {
  const contract = await getUserRegistryContract();
  const tx = await contract.registerUser(name, email);
  return await tx.wait();
};

// Get user details
export const getUserDetails = async (address) => {
  const contract = await getUserRegistryContract();
  return await contract.getUserDetails(address);
};

// Verify user (admin only)
export const verifyUser = async (address) => {
  const contract = await getUserRegistryContract();
  const tx = await contract.verifyUser(address);
  return await tx.wait();
};

// Create event
export const createEvent = async (name, description, imageURI, ticketPrice, totalTickets) => {
  const contract = await getEventTicketingContract();
  const tx = await contract.createEvent(
    name,
    description,
    imageURI,
    ethers.utils.parseEther(ticketPrice.toString()),
    totalTickets
  );
  return await tx.wait();
};

// Get all events
export const getAllEvents = async () => {
  const contract = await getEventTicketingContract();
  const eventIds = await contract.getAllEvents();
  
  const events = [];
  for (const id of eventIds) {
    const eventDetails = await contract.getEventDetails(id);
    events.push({
      id: id.toString(),
      name: eventDetails[0],
      description: eventDetails[1],
      imageURI: eventDetails[2],
      ticketPrice: ethers.utils.formatEther(eventDetails[3]),
      totalTickets: eventDetails[4].toString(),
      availableTickets: eventDetails[5].toString(),
      organizer: eventDetails[6],
      isActive: eventDetails[7]
    });
  }
  
  return events;
};

// Get event details
export const getEventDetails = async (eventId) => {
  const contract = await getEventTicketingContract();
  const eventDetails = await contract.getEventDetails(eventId);
  
  return {
    id: eventId,
    name: eventDetails[0],
    description: eventDetails[1],
    imageURI: eventDetails[2],
    ticketPrice: ethers.utils.formatEther(eventDetails[3]),
    totalTickets: eventDetails[4].toString(),
    availableTickets: eventDetails[5].toString(),
    organizer: eventDetails[6],
    isActive: eventDetails[7]
  };
};

// Purchase ticket
export const purchaseTicket = async (eventId, tokenURI, ticketPrice) => {
  const contract = await getEventTicketingContract();
  const tx = await contract.purchaseTicket(
    eventId,
    tokenURI,
    { value: ethers.utils.parseEther(ticketPrice.toString()) }
  );
  return await tx.wait();
};

// Get user tickets
export const getUserTickets = async (address) => {
  const contract = await getEventTicketingContract();
  const ticketIds = await contract.getUserTickets(address);
  
  const tickets = [];
  for (const id of ticketIds) {
    const ticketDetails = await contract.getTicketDetails(id);
    const eventDetails = await contract.getEventDetails(ticketDetails[0]);
    
    tickets.push({
      id: id.toString(),
      eventId: ticketDetails[0].toString(),
      eventName: eventDetails[0],
      owner: ticketDetails[1],
      isUsed: ticketDetails[2],
      imageURI: eventDetails[2]
    });
  }
  
  return tickets;
};

// Verify ticket
export const verifyTicket = async (ticketId, owner) => {
  const contract = await getEventTicketingContract();
  return await contract.verifyTicket(ticketId, owner);
};

// Mark ticket as used
export const useTicket = async (ticketId) => {
  const contract = await getEventTicketingContract();
  const tx = await contract.useTicket(ticketId);
  return await tx.wait();
};
