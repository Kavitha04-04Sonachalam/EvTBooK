import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventIcon from '@mui/icons-material/Event';
import { getUserDetails } from '../utils/contracts';

const Profile = ({ account }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const details = await getUserDetails(account);
        setUserDetails({
          name: details[0],
          email: details[1],
          isVerified: details[2],
          bio: 'Blockchain enthusiast and event-goer. I love attending concerts and tech conferences!', // Default bio since it's not in the contract
        });
        setName(details[0]);
        setEmail(details[1]);
        setBio('Blockchain enthusiast and event-goer. I love attending concerts and tech conferences!');
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (account) {
      fetchUserDetails();
    }
  }, [account]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditProfile = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setName(userDetails.name);
    setEmail(userDetails.email);
    setBio(userDetails.bio);
    setEditing(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // In a real app, you would update the user details in the contract here
      // For now, we'll just update the local state
      setUserDetails({
        ...userDetails,
        name,
        email,
        bio,
      });
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ pt: 4, pb: 2 }}>
          <Typography component="h1" variant="h3" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account information and view your activity
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Profile Information */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      bgcolor: 'primary.main',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: 80 }} />
                  </Avatar>
                  <Typography variant="h5" gutterBottom>
                    {userDetails.name}
                  </Typography>
                  <Chip
                    label={userDetails.isVerified ? 'Verified User' : 'Unverified User'}
                    color={userDetails.isVerified ? 'success' : 'default'}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" align="center">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </Typography>
                </Box>

                {!editing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    fullWidth
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      disabled={saving}
                      sx={{ flex: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={saving}
                      sx={{ flex: 1 }}
                    >
                      {saving ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Profile Details and Activity */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper elevation={3} sx={{ borderRadius: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label="Profile Details" />
                  <Tab label="Activity" />
                </Tabs>

                {/* Profile Details Tab */}
                {tabValue === 0 && (
                  <Box sx={{ p: 3 }}>
                    {editing ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Personal Information
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Full Name
                            </Typography>
                            <Typography variant="body1">{userDetails.name}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Email
                            </Typography>
                            <Typography variant="body1">{userDetails.email}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Bio
                            </Typography>
                            <Typography variant="body1">{userDetails.bio}</Typography>
                          </Grid>
                        </Grid>

                        <Typography variant="h6" gutterBottom>
                          Blockchain Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Wallet Address
                            </Typography>
                            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                              {account}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Activity Tab */}
                {tabValue === 1 && (
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    
                    <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ConfirmationNumberIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">Purchased Ticket</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          You purchased a ticket for "Blockchain Summit 2023" on June 15, 2023
                        </Typography>
                      </CardContent>
                    </Card>
                    
                    <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EventIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">Created Event</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          You created the event "Web3 Developers Meetup" on May 20, 2023
                        </Typography>
                      </CardContent>
                    </Card>
                    
                    <Card sx={{ bgcolor: 'background.paper' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccountCircleIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">Account Verified</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Your account was verified by an admin on May 10, 2023
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Profile;
