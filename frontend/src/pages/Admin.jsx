import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getUserRegistryContract } from '../utils/contracts';
import { ethers } from 'ethers';

const Admin = ({ account }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [addressToCheck, setAddressToCheck] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const contract = await getUserRegistryContract();
        const owner = await contract.owner();
        setIsOwner(owner.toLowerCase() === account.toLowerCase());
        
        if (owner.toLowerCase() === account.toLowerCase()) {
          // Load initial users (this is just a placeholder since we can't list all users from the contract)
          // In a real app, you might have an indexer or backend service to track registered users
          setUsers([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking ownership:', error);
        setError('Failed to check admin status. Please try again later.');
        setLoading(false);
      }
    };

    checkOwnership();
  }, [account]);

  const handleOpenAddressDialog = () => {
    setAddressToCheck('');
    setUserDetails(null);
    setOpenAddressDialog(true);
  };

  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false);
  };

  const handleCheckAddress = async () => {
    try {
      if (!ethers.utils.isAddress(addressToCheck)) {
        throw new Error('Invalid Ethereum address');
      }

      const contract = await getUserRegistryContract();
      
      // Check if user is registered
      const isRegistered = await contract.isUserRegistered(addressToCheck);
      
      if (!isRegistered) {
        setUserDetails({ exists: false });
        return;
      }
      
      // Get user details
      const details = await contract.getUserDetails(addressToCheck);
      
      setUserDetails({
        exists: true,
        address: addressToCheck,
        name: details[0],
        email: details[1],
        isVerified: details[2],
      });
      
      // Add to users list if not already there
      setUsers((prevUsers) => {
        const exists = prevUsers.some((user) => user.address.toLowerCase() === addressToCheck.toLowerCase());
        if (!exists) {
          return [...prevUsers, {
            address: addressToCheck,
            name: details[0],
            email: details[1],
            isVerified: details[2],
          }];
        }
        return prevUsers;
      });
    } catch (error) {
      console.error('Error checking address:', error);
      setError('Failed to check address. Please try again.');
    }
  };

  const handleVerifyUser = async (address) => {
    setVerifying(true);
    try {
      const contract = await getUserRegistryContract();
      const tx = await contract.verifyUser(address);
      await tx.wait();
      
      // Update user in the list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.address.toLowerCase() === address.toLowerCase()
            ? { ...user, isVerified: true }
            : user
        )
      );
      
      // Update user details if in dialog
      if (userDetails && userDetails.address.toLowerCase() === address.toLowerCase()) {
        setUserDetails({ ...userDetails, isVerified: true });
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      setError('Failed to verify user. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleRevokeVerification = async (address) => {
    setRevoking(true);
    try {
      const contract = await getUserRegistryContract();
      const tx = await contract.revokeVerification(address);
      await tx.wait();
      
      // Update user in the list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.address.toLowerCase() === address.toLowerCase()
            ? { ...user, isVerified: false }
            : user
        )
      );
      
      // Update user details if in dialog
      if (userDetails && userDetails.address.toLowerCase() === address.toLowerCase()) {
        setUserDetails({ ...userDetails, isVerified: false });
      }
    } catch (error) {
      console.error('Error revoking verification:', error);
      setError('Failed to revoke verification. Please try again.');
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!isOwner) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Only the contract owner can access the admin panel.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/events')}
            sx={{ mt: 2 }}
          >
            Back to Events
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 4, pb: 2 }}>
        <Typography component="h1" variant="h3" gutterBottom>
          Admin Panel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage user verifications and platform settings
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">User Management</Typography>
          <Button
            variant="contained"
            onClick={handleOpenAddressDialog}
          >
            Check Address
          </Button>
        </Box>

        {users.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No users have been checked yet. Use the "Check Address" button to verify user details.
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.address}>
                    <TableCell>
                      {`${user.address.substring(0, 6)}...${user.address.substring(user.address.length - 4)}`}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={user.isVerified ? <CheckCircleIcon /> : <CancelIcon />}
                        label={user.isVerified ? 'Verified' : 'Unverified'}
                        color={user.isVerified ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      {user.isVerified ? (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRevokeVerification(user.address)}
                          disabled={revoking}
                        >
                          Revoke
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleVerifyUser(user.address)}
                          disabled={verifying}
                        >
                          Verify
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Check Address Dialog */}
      <Dialog open={openAddressDialog} onClose={handleCloseAddressDialog}>
        <DialogTitle>Check User Address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter an Ethereum address to check if the user is registered and view their details.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Ethereum Address"
            type="text"
            fullWidth
            variant="outlined"
            value={addressToCheck}
            onChange={(e) => setAddressToCheck(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleCheckAddress}
            disabled={!addressToCheck}
            sx={{ mb: 2 }}
          >
            Check Address
          </Button>

          {userDetails && (
            <Box sx={{ mt: 2 }}>
              {userDetails.exists ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    User Details
                  </Typography>
                  <Typography variant="body1">
                    <strong>Name:</strong> {userDetails.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {userDetails.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Status:</strong>{' '}
                    <Chip
                      icon={userDetails.isVerified ? <CheckCircleIcon /> : <CancelIcon />}
                      label={userDetails.isVerified ? 'Verified' : 'Unverified'}
                      color={userDetails.isVerified ? 'success' : 'default'}
                      size="small"
                    />
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {userDetails.isVerified ? (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRevokeVerification(userDetails.address)}
                        disabled={revoking}
                      >
                        Revoke Verification
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleVerifyUser(userDetails.address)}
                        disabled={verifying}
                      >
                        Verify User
                      </Button>
                    )}
                  </Box>
                </>
              ) : (
                <Alert severity="warning">
                  This address is not registered in the system.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;
