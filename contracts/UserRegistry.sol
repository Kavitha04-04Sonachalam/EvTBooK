// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UserRegistry
 * @dev Contract for registering and verifying users for the event ticketing platform
 */
contract UserRegistry is Ownable {
    struct User {
        string name;
        string email;
        bool isVerified;
        bool exists;
    }

    // Mapping from user address to user data
    mapping(address => User) private users;

    // Events
    event UserRegistered(address indexed userAddress, string name, string email);
    event UserVerified(address indexed userAddress);
    event UserVerificationRevoked(address indexed userAddress);

    constructor() {}

    /**
     * @dev Register a new user
     * @param _name Name of the user
     * @param _email Email of the user
     */
    function registerUser(string memory _name, string memory _email) external {
        require(!users[msg.sender].exists, "User already registered");

        users[msg.sender] = User({
            name: _name,
            email: _email,
            isVerified: false,
            exists: true
        });

        emit UserRegistered(msg.sender, _name, _email);
    }

    /**
     * @dev Verify a user (only owner can call)
     * @param _userAddress Address of the user to verify
     */
    function verifyUser(address _userAddress) external onlyOwner {
        require(users[_userAddress].exists, "User does not exist");
        require(!users[_userAddress].isVerified, "User already verified");

        users[_userAddress].isVerified = true;

        emit UserVerified(_userAddress);
    }

    /**
     * @dev Revoke verification of a user (only owner can call)
     * @param _userAddress Address of the user to revoke verification
     */
    function revokeVerification(address _userAddress) external onlyOwner {
        require(users[_userAddress].exists, "User does not exist");
        require(users[_userAddress].isVerified, "User not verified");

        users[_userAddress].isVerified = false;

        emit UserVerificationRevoked(_userAddress);
    }

    /**
     * @dev Check if a user is registered
     * @param _userAddress Address of the user to check
     * @return bool True if user is registered
     */
    function isUserRegistered(address _userAddress) external view returns (bool) {
        return users[_userAddress].exists;
    }

    /**
     * @dev Check if a user is verified
     * @param _userAddress Address of the user to check
     * @return bool True if user is verified
     */
    function isUserVerified(address _userAddress) external view returns (bool) {
        return users[_userAddress].exists && users[_userAddress].isVerified;
    }

    /**
     * @dev Get user details
     * @param _userAddress Address of the user
     * @return name User's name
     * @return email User's email
     * @return isVerified User's verification status
     */
    function getUserDetails(address _userAddress) external view returns (
        string memory name,
        string memory email,
        bool isVerified
    ) {
        require(users[_userAddress].exists, "User does not exist");

        User memory user = users[_userAddress];
        return (user.name, user.email, user.isVerified);
    }
}
