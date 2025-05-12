// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./UserRegistry.sol";

/**
 * @title EventTicketing
 * @dev Contract for creating events and minting tickets as NFTs
 */
contract EventTicketing is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    // Counter for ticket IDs
    Counters.Counter private _ticketIds;

    // Counter for event IDs
    Counters.Counter private _eventIds;

    // Reference to the UserRegistry contract
    UserRegistry private userRegistry;

    // Struct to store event details
    struct Event {
        uint256 eventId;
        string name;
        string description;
        string imageURI;
        uint256 ticketPrice;
        uint256 totalTickets;
        uint256 availableTickets;
        address organizer;
        bool isActive;
    }

    // Struct to store ticket details
    struct Ticket {
        uint256 ticketId;
        uint256 eventId;
        address owner;
        bool isUsed;
    }

    // Mapping from event ID to Event
    mapping(uint256 => Event) private events;

    // Mapping from ticket ID to Ticket
    mapping(uint256 => Ticket) private tickets;

    // Mapping from event ID to array of ticket IDs
    mapping(uint256 => uint256[]) private eventTickets;

    // Mapping from user address to array of owned ticket IDs
    mapping(address => uint256[]) private userTickets;

    // Events
    event EventCreated(
        uint256 indexed eventId,
        string name,
        uint256 ticketPrice,
        uint256 totalTickets,
        address organizer
    );

    event TicketPurchased(
        uint256 indexed ticketId,
        uint256 indexed eventId,
        address buyer
    );

    event TicketTransferred(
        uint256 indexed ticketId,
        address from,
        address to
    );

    event TicketUsed(uint256 indexed ticketId);

    event EventCancelled(uint256 indexed eventId);

    /**
     * @dev Constructor
     * @param _userRegistryAddress Address of the UserRegistry contract
     */
    constructor(address _userRegistryAddress) ERC721("EventTicket", "ETKT") {
        userRegistry = UserRegistry(_userRegistryAddress);
    }

    /**
     * @dev Create a new event
     * @param _name Name of the event
     * @param _description Description of the event
     * @param _imageURI URI of the event image
     * @param _ticketPrice Price of each ticket in wei
     * @param _totalTickets Total number of tickets available
     */
    function createEvent(
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _ticketPrice,
        uint256 _totalTickets
    ) external {
        require(userRegistry.isUserVerified(msg.sender), "Only verified users can create events");
        require(_totalTickets > 0, "Total tickets must be greater than zero");

        _eventIds.increment();
        uint256 newEventId = _eventIds.current();

        events[newEventId] = Event({
            eventId: newEventId,
            name: _name,
            description: _description,
            imageURI: _imageURI,
            ticketPrice: _ticketPrice,
            totalTickets: _totalTickets,
            availableTickets: _totalTickets,
            organizer: msg.sender,
            isActive: true
        });

        emit EventCreated(newEventId, _name, _ticketPrice, _totalTickets, msg.sender);
    }

    /**
     * @dev Purchase a ticket for an event
     * @param _eventId ID of the event
     * @param _tokenURI URI for the ticket metadata
     */
    function purchaseTicket(uint256 _eventId, string memory _tokenURI) external payable {
        require(userRegistry.isUserRegistered(msg.sender), "Only registered users can purchase tickets");

        Event storage eventDetails = events[_eventId];

        require(eventDetails.isActive, "Event is not active");
        require(eventDetails.availableTickets > 0, "No tickets available");
        require(msg.value >= eventDetails.ticketPrice, "Insufficient payment");

        // Mint a new ticket NFT
        _ticketIds.increment();
        uint256 newTicketId = _ticketIds.current();

        _mint(msg.sender, newTicketId);
        _setTokenURI(newTicketId, _tokenURI);

        // Create ticket record
        tickets[newTicketId] = Ticket({
            ticketId: newTicketId,
            eventId: _eventId,
            owner: msg.sender,
            isUsed: false
        });

        // Update event available tickets
        eventDetails.availableTickets--;

        // Add ticket to event's tickets
        eventTickets[_eventId].push(newTicketId);

        // Add ticket to user's tickets
        userTickets[msg.sender].push(newTicketId);

        // Transfer payment to event organizer
        payable(eventDetails.organizer).transfer(msg.value);

        emit TicketPurchased(newTicketId, _eventId, msg.sender);
    }

    /**
     * @dev Override transferFrom to implement anti-scalping rules
     */
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(userRegistry.isUserRegistered(to), "Recipient must be a registered user");
        require(!tickets[tokenId].isUsed, "Ticket has already been used");

        super.transferFrom(from, to, tokenId);

        // Update ticket owner
        tickets[tokenId].owner = to;

        // Update user tickets mappings
        // Remove from previous owner
        uint256[] storage fromTickets = userTickets[from];
        for (uint256 i = 0; i < fromTickets.length; i++) {
            if (fromTickets[i] == tokenId) {
                fromTickets[i] = fromTickets[fromTickets.length - 1];
                fromTickets.pop();
                break;
            }
        }

        // Add to new owner
        userTickets[to].push(tokenId);

        emit TicketTransferred(tokenId, from, to);
    }

    /**
     * @dev Override safeTransferFrom to implement anti-scalping rules
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev Override safeTransferFrom with data to implement anti-scalping rules
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        require(userRegistry.isUserRegistered(to), "Recipient must be a registered user");
        require(!tickets[tokenId].isUsed, "Ticket has already been used");

        super.safeTransferFrom(from, to, tokenId, data);

        // Update ticket owner
        tickets[tokenId].owner = to;

        // Update user tickets mappings
        // Remove from previous owner
        uint256[] storage fromTickets = userTickets[from];
        for (uint256 i = 0; i < fromTickets.length; i++) {
            if (fromTickets[i] == tokenId) {
                fromTickets[i] = fromTickets[fromTickets.length - 1];
                fromTickets.pop();
                break;
            }
        }

        // Add to new owner
        userTickets[to].push(tokenId);

        emit TicketTransferred(tokenId, from, to);
    }

    /**
     * @dev Mark a ticket as used (only event organizer can call)
     * @param _ticketId ID of the ticket
     */
    function useTicket(uint256 _ticketId) external {
        Ticket storage ticket = tickets[_ticketId];
        uint256 eventId = ticket.eventId;

        require(events[eventId].organizer == msg.sender, "Only event organizer can mark tickets as used");
        require(!ticket.isUsed, "Ticket has already been used");

        ticket.isUsed = true;

        emit TicketUsed(_ticketId);
    }

    /**
     * @dev Cancel an event (only event organizer can call)
     * @param _eventId ID of the event
     */
    function cancelEvent(uint256 _eventId) external {
        Event storage eventDetails = events[_eventId];

        require(eventDetails.organizer == msg.sender, "Only event organizer can cancel the event");
        require(eventDetails.isActive, "Event is already cancelled");

        eventDetails.isActive = false;

        emit EventCancelled(_eventId);
    }

    /**
     * @dev Get event details
     * @param _eventId ID of the event
     */
    function getEventDetails(uint256 _eventId) external view returns (
        string memory name,
        string memory description,
        string memory imageURI,
        uint256 ticketPrice,
        uint256 totalTickets,
        uint256 availableTickets,
        address organizer,
        bool isActive
    ) {
        Event memory eventDetails = events[_eventId];

        return (
            eventDetails.name,
            eventDetails.description,
            eventDetails.imageURI,
            eventDetails.ticketPrice,
            eventDetails.totalTickets,
            eventDetails.availableTickets,
            eventDetails.organizer,
            eventDetails.isActive
        );
    }

    /**
     * @dev Get ticket details
     * @param _ticketId ID of the ticket
     */
    function getTicketDetails(uint256 _ticketId) external view returns (
        uint256 eventId,
        address owner,
        bool isUsed
    ) {
        Ticket memory ticket = tickets[_ticketId];

        return (
            ticket.eventId,
            ticket.owner,
            ticket.isUsed
        );
    }

    /**
     * @dev Get all events
     * @return Array of event IDs
     */
    function getAllEvents() external view returns (uint256[] memory) {
        uint256 eventCount = _eventIds.current();
        uint256[] memory allEvents = new uint256[](eventCount);

        for (uint256 i = 0; i < eventCount; i++) {
            allEvents[i] = i + 1;
        }

        return allEvents;
    }

    /**
     * @dev Get user's tickets
     * @param _user Address of the user
     * @return Array of ticket IDs
     */
    function getUserTickets(address _user) external view returns (uint256[] memory) {
        return userTickets[_user];
    }

    /**
     * @dev Get event's tickets
     * @param _eventId ID of the event
     * @return Array of ticket IDs
     */
    function getEventTickets(uint256 _eventId) external view returns (uint256[] memory) {
        return eventTickets[_eventId];
    }

    /**
     * @dev Verify ticket ownership and validity
     * @param _ticketId ID of the ticket
     * @param _owner Address claiming to be the owner
     * @return bool True if the ticket is valid and owned by the address
     */
    function verifyTicket(uint256 _ticketId, address _owner) external view returns (bool) {
        Ticket memory ticket = tickets[_ticketId];

        return (ticket.owner == _owner && !ticket.isUsed && events[ticket.eventId].isActive);
    }
}
