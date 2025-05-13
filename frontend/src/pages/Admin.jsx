import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
  Avatar,
  Badge,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BlockIcon from '@mui/icons-material/Block';
import EventIcon from '@mui/icons-material/Event';
import DashboardIcon from '@mui/icons-material/Dashboard';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const theme = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Container maxWidth="lg">
        <Box sx={{ pt: 4, pb: 2 }}>
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AdminPanelSettingsIcon
                sx={{
                  fontSize: 40,
                  color: 'primary.main',
                  mr: 2
                }}
              />
              <Typography
                component="h1"
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)'
                    : 'linear-gradient(45deg, #3f51b5 30%, #002984 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0
                }}
              >
                Admin Panel
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ ml: 7 }}>
              Manage user verifications and platform settings
            </Typography>
          </motion.div>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Dashboard Cards */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card
                  sx={{
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                      : '0 8px 16px rgba(0, 0, 0, 0.1)',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(63, 81, 181, 0.1)',
                      zIndex: 0
                    }}
                  />
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 56,
                          height: 56,
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <PeopleIcon fontSize="large" />
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h4" component="div" fontWeight="bold">
                          {users.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Users
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card
                  sx={{
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                      : '0 8px 16px rgba(0, 0, 0, 0.1)',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(76, 175, 80, 0.1)',
                      zIndex: 0
                    }}
                  />
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'success.main',
                          width: 56,
                          height: 56,
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <VerifiedUserIcon fontSize="large" />
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h4" component="div" fontWeight="bold">
                          {users.filter(user => user.isVerified).length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Verified Users
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card
                  sx={{
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                      : '0 8px 16px rgba(0, 0, 0, 0.1)',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(244, 67, 54, 0.1)',
                      zIndex: 0
                    }}
                  />
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'error.main',
                          width: 56,
                          height: 56,
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <BlockIcon fontSize="large" />
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h4" component="div" fontWeight="bold">
                          {users.filter(user => !user.isVerified).length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Verification
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card
                  sx={{
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                      : '0 8px 16px rgba(0, 0, 0, 0.1)',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(245, 0, 87, 0.1)',
                      zIndex: 0
                    }}
                  />
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'secondary.main',
                          width: 56,
                          height: 56,
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <EventIcon fontSize="large" />
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h4" component="div" fontWeight="bold">
                          0
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Events
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                : '0 8px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>User Management</Typography>
              </Box>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  onClick={handleOpenAddressDialog}
                  startIcon={<SearchIcon />}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
                    boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  Check Address
                </Button>
              </motion.div>
            </Box>

        {users.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No users have been checked yet. Use the "Check Address" button to verify user details.
          </Alert>
        ) : (
          <TableContainer sx={{
            borderRadius: 2,
            overflow: 'hidden',
            '& .MuiTableCell-head': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(63, 81, 181, 0.2)' : 'rgba(63, 81, 181, 0.1)',
              fontWeight: 'bold',
            },
            '& .MuiTableRow-root:nth-of-type(even)': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            },
            '& .MuiTableRow-root:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
            },
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.address}>
                    <TableCell>
                      <Tooltip title={user.address}>
                        <span>{`${user.address.substring(0, 6)}...${user.address.substring(user.address.length - 4)}`}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={user.isVerified ? <CheckCircleIcon /> : <CancelIcon />}
                        label={user.isVerified ? 'Verified' : 'Unverified'}
                        color={user.isVerified ? 'success' : 'default'}
                        sx={{
                          fontWeight: 'medium',
                          boxShadow: user.isVerified ? '0 2px 5px rgba(76, 175, 80, 0.3)' : 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {user.isVerified ? (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleRevokeVerification(user.address)}
                            disabled={revoking}
                            startIcon={<BlockIcon />}
                            sx={{
                              borderRadius: 2,
                              borderWidth: 2,
                              '&:hover': {
                                borderWidth: 2,
                              }
                            }}
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
                            startIcon={<VerifiedUserIcon />}
                            sx={{
                              borderRadius: 2,
                              boxShadow: '0 2px 5px rgba(76, 175, 80, 0.3)',
                              '&:hover': {
                                boxShadow: '0 4px 8px rgba(76, 175, 80, 0.4)',
                              }
                            }}
                          >
                            Verify
                          </Button>
                        )}
                      </motion.div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      </motion.div>

      {/* Check Address Dialog */}
      <Dialog
        open={openAddressDialog}
        onClose={handleCloseAddressDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          pb: 2
        }}>
          <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Check User Address
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
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
            sx={{
              mt: 2,
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="contained"
              onClick={handleCheckAddress}
              disabled={!addressToCheck}
              startIcon={<SearchIcon />}
              sx={{
                mb: 2,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
                boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              Check Address
            </Button>
          </motion.div>

          {userDetails && (
            <Box sx={{ mt: 3 }}>
              {userDetails.exists ? (
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <PersonAddIcon sx={{ mr: 1 }} />
                    User Details
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {userDetails.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {userDetails.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Status
                      </Typography>
                      <Chip
                        icon={userDetails.isVerified ? <CheckCircleIcon /> : <CancelIcon />}
                        label={userDetails.isVerified ? 'Verified' : 'Unverified'}
                        color={userDetails.isVerified ? 'success' : 'default'}
                        size="medium"
                        sx={{
                          fontWeight: 'medium',
                          boxShadow: userDetails.isVerified ? '0 2px 5px rgba(76, 175, 80, 0.3)' : 'none',
                          px: 1
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      {userDetails.isVerified ? (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRevokeVerification(userDetails.address)}
                          disabled={revoking}
                          startIcon={<BlockIcon />}
                          sx={{
                            borderRadius: 2,
                            borderWidth: 2,
                            px: 3,
                            '&:hover': {
                              borderWidth: 2,
                            }
                          }}
                        >
                          Revoke Verification
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleVerifyUser(userDetails.address)}
                          disabled={verifying}
                          startIcon={<VerifiedUserIcon />}
                          sx={{
                            borderRadius: 2,
                            px: 3,
                            boxShadow: '0 2px 5px rgba(76, 175, 80, 0.3)',
                            '&:hover': {
                              boxShadow: '0 4px 8px rgba(76, 175, 80, 0.4)',
                            }
                          }}
                        >
                          Verify User
                        </Button>
                      )}
                    </motion.div>
                  </Box>
                </Paper>
              ) : (
                <Alert
                  severity="warning"
                  variant="filled"
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem'
                    }
                  }}
                >
                  This address is not registered in the system.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', p: 2 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleCloseAddressDialog}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                borderWidth: 1,
                '&:hover': {
                  borderWidth: 1,
                }
              }}
            >
              Close
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>
    </Container>
    </motion.div>
  );
};

export default Admin;
