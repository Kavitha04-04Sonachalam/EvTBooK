const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Event Ticketing System", function () {
  let userRegistry;
  let eventTicketing;
  let owner;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy UserRegistry
    const UserRegistry = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistry.deploy();
    await userRegistry.deploymentTransaction().wait();

    // Deploy EventTicketing
    const EventTicketing = await ethers.getContractFactory("EventTicketing");
    eventTicketing = await EventTicketing.deploy(userRegistry.target);
    await eventTicketing.deploymentTransaction().wait();
  });

  describe("User Registration", function () {
    it("Should register a user", async function () {
      await userRegistry.connect(user1).registerUser("John Doe", "john@example.com");
      
      expect(await userRegistry.isUserRegistered(user1.address)).to.equal(true);
      
      const userDetails = await userRegistry.getUserDetails(user1.address);
      expect(userDetails[0]).to.equal("John Doe");
      expect(userDetails[1]).to.equal("john@example.com");
      expect(userDetails[2]).to.equal(false); // Not verified yet
    });

    it("Should verify a user", async function () {
      await userRegistry.connect(user1).registerUser("John Doe", "john@example.com");
      await userRegistry.connect(owner).verifyUser(user1.address);
      
      expect(await userRegistry.isUserVerified(user1.address)).to.equal(true);
    });

    it("Should not allow non-owner to verify a user", async function () {
      await userRegistry.connect(user1).registerUser("John Doe", "john@example.com");
      
      await expect(
        userRegistry.connect(user2).verifyUser(user1.address)
      ).to.be.reverted;
    });
  });

  describe("Event Creation", function () {
    beforeEach(async function () {
      // Register and verify user1
      await userRegistry.connect(user1).registerUser("John Doe", "john@example.com");
      await userRegistry.connect(owner).verifyUser(user1.address);
    });

    it("Should allow verified user to create an event", async function () {
      await eventTicketing.connect(user1).createEvent(
        "Concert",
        "A great concert",
        "ipfs://QmImageHash",
        ethers.parseEther("0.1"),
        100
      );
      
      const eventDetails = await eventTicketing.getEventDetails(1);
      expect(eventDetails[0]).to.equal("Concert");
      expect(eventDetails[1]).to.equal("A great concert");
      expect(eventDetails[2]).to.equal("ipfs://QmImageHash");
      expect(eventDetails[3]).to.equal(ethers.parseEther("0.1"));
      expect(eventDetails[4]).to.equal(100); // totalTickets
      expect(eventDetails[5]).to.equal(100); // availableTickets
      expect(eventDetails[6]).to.equal(user1.address); // organizer
      expect(eventDetails[7]).to.equal(true); // isActive
    });

    it("Should not allow unverified user to create an event", async function () {
      await userRegistry.connect(user2).registerUser("Jane Doe", "jane@example.com");
      
      await expect(
        eventTicketing.connect(user2).createEvent(
          "Concert",
          "A great concert",
          "ipfs://QmImageHash",
          ethers.parseEther("0.1"),
          100
        )
      ).to.be.reverted;
    });
  });

  describe("Ticket Purchase", function () {
    beforeEach(async function () {
      // Register and verify user1 (event organizer)
      await userRegistry.connect(user1).registerUser("John Doe", "john@example.com");
      await userRegistry.connect(owner).verifyUser(user1.address);
      
      // Create an event
      await eventTicketing.connect(user1).createEvent(
        "Concert",
        "A great concert",
        "ipfs://QmImageHash",
        ethers.parseEther("0.1"),
        100
      );
      
      // Register user2 (ticket buyer)
      await userRegistry.connect(user2).registerUser("Jane Doe", "jane@example.com");
    });

    it("Should allow registered user to purchase a ticket", async function () {
      await eventTicketing.connect(user2).purchaseTicket(
        1, // eventId
        "ipfs://QmTicketMetadata",
        { value: ethers.parseEther("0.1") }
      );
      
      // Check ticket ownership
      const userTickets = await eventTicketing.getUserTickets(user2.address);
      expect(userTickets.length).to.equal(1);
      expect(userTickets[0]).to.equal(1);
      
      // Check ticket details
      const ticketDetails = await eventTicketing.getTicketDetails(1);
      expect(ticketDetails[0]).to.equal(1); // eventId
      expect(ticketDetails[1]).to.equal(user2.address); // owner
      expect(ticketDetails[2]).to.equal(false); // isUsed
      
      // Check event available tickets
      const eventDetails = await eventTicketing.getEventDetails(1);
      expect(eventDetails[5]).to.equal(99); // availableTickets
    });

    it("Should not allow unregistered user to purchase a ticket", async function () {
      await expect(
        eventTicketing.connect(user3).purchaseTicket(
          1, // eventId
          "ipfs://QmTicketMetadata",
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.reverted;
    });

    it("Should not allow purchase with insufficient payment", async function () {
      await expect(
        eventTicketing.connect(user2).purchaseTicket(
          1, // eventId
          "ipfs://QmTicketMetadata",
          { value: ethers.parseEther("0.05") }
        )
      ).to.be.reverted;
    });
  });

  describe("Ticket Transfer", function () {
    beforeEach(async function () {
      // Register and verify user1 (event organizer)
      await userRegistry.connect(user1).registerUser("John Doe", "john@example.com");
      await userRegistry.connect(owner).verifyUser(user1.address);
      
      // Create an event
      await eventTicketing.connect(user1).createEvent(
        "Concert",
        "A great concert",
        "ipfs://QmImageHash",
        ethers.parseEther("0.1"),
        100
      );
      
      // Register user2 and user3
      await userRegistry.connect(user2).registerUser("Jane Doe", "jane@example.com");
      await userRegistry.connect(user3).registerUser("Bob Smith", "bob@example.com");
      
      // User2 purchases a ticket
      await eventTicketing.connect(user2).purchaseTicket(
        1, // eventId
        "ipfs://QmTicketMetadata",
        { value: ethers.parseEther("0.1") }
      );
    });

    it("Should allow transfer of ticket to registered user", async function () {
      // Approve transfer
      await eventTicketing.connect(user2).approve(user3.address, 1);
      
      // Transfer ticket
      await eventTicketing.connect(user2).transferFrom(user2.address, user3.address, 1);
      
      // Check new ownership
      const ticketDetails = await eventTicketing.getTicketDetails(1);
      expect(ticketDetails[1]).to.equal(user3.address);
      
      // Check user tickets
      const user2Tickets = await eventTicketing.getUserTickets(user2.address);
      expect(user2Tickets.length).to.equal(0);
      
      const user3Tickets = await eventTicketing.getUserTickets(user3.address);
      expect(user3Tickets.length).to.equal(1);
      expect(user3Tickets[0]).to.equal(1);
    });

    it("Should not allow transfer to unregistered user", async function () {
      const [, , , , unregisteredUser] = await ethers.getSigners();
      
      // Approve transfer
      await eventTicketing.connect(user2).approve(unregisteredUser.address, 1);
      
      // Attempt transfer
      await expect(
        eventTicketing.connect(user2).transferFrom(user2.address, unregisteredUser.address, 1)
      ).to.be.reverted;
    });
  });

  describe("Ticket Validation", function () {
    beforeEach(async function () {
      // Register and verify user1 (event organizer)
      await userRegistry.connect(user1).registerUser("John Doe", "john@example.com");
      await userRegistry.connect(owner).verifyUser(user1.address);
      
      // Create an event
      await eventTicketing.connect(user1).createEvent(
        "Concert",
        "A great concert",
        "ipfs://QmImageHash",
        ethers.parseEther("0.1"),
        100
      );
      
      // Register user2
      await userRegistry.connect(user2).registerUser("Jane Doe", "jane@example.com");
      
      // User2 purchases a ticket
      await eventTicketing.connect(user2).purchaseTicket(
        1, // eventId
        "ipfs://QmTicketMetadata",
        { value: ethers.parseEther("0.1") }
      );
    });

    it("Should verify valid ticket", async function () {
      expect(await eventTicketing.verifyTicket(1, user2.address)).to.equal(true);
    });

    it("Should not verify ticket with wrong owner", async function () {
      expect(await eventTicketing.verifyTicket(1, user3.address)).to.equal(false);
    });

    it("Should mark ticket as used", async function () {
      await eventTicketing.connect(user1).useTicket(1);
      
      const ticketDetails = await eventTicketing.getTicketDetails(1);
      expect(ticketDetails[2]).to.equal(true); // isUsed
      
      // Verify should now return false
      expect(await eventTicketing.verifyTicket(1, user2.address)).to.equal(false);
    });

    it("Should not allow non-organizer to mark ticket as used", async function () {
      await expect(
        eventTicketing.connect(user3).useTicket(1)
      ).to.be.reverted;
    });
  });
});
