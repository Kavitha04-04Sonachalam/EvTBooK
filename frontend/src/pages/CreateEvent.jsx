import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createEvent, isUserVerified } from '../utils/contracts';
import { uploadFileToIPFS } from '../utils/ipfs';

const CreateEvent = ({ account }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const navigate = useNavigate();

  // Check if user is verified
  useState(() => {
    const checkVerification = async () => {
      try {
        const verified = await isUserVerified(account);
        if (!verified) {
          setVerificationError(true);
        }
      } catch (error) {
        console.error('Error checking verification:', error);
        setVerificationError(true);
      }
    };

    checkVerification();
  }, [account]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!name || !description || !ticketPrice || !totalTickets || !image) {
        throw new Error('Please fill in all fields and upload an image');
      }

      if (isNaN(parseFloat(ticketPrice)) || parseFloat(ticketPrice) <= 0) {
        throw new Error('Ticket price must be a positive number');
      }

      if (isNaN(parseInt(totalTickets)) || parseInt(totalTickets) <= 0) {
        throw new Error('Total tickets must be a positive integer');
      }

      // Upload image to IPFS
      const imageURI = await uploadFileToIPFS(image);
      
      // Create event on blockchain
      await createEvent(
        name,
        description,
        imageURI,
        parseFloat(ticketPrice),
        parseInt(totalTickets)
      );

      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/events');
      }, 3000);
    } catch (error) {
      console.error('Event creation error:', error);
      setError(error.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verificationError) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Your account has not been verified by an admin yet. Only verified users can create events.
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
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4, borderRadius: 2 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Create New Event
        </Typography>
        
        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Event created successfully! You will be redirected to the events page.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Event Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Event Description"
                  name="description"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="ticketPrice"
                  label="Ticket Price"
                  name="ticketPrice"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                    inputProps: { min: 0, step: 0.001 }
                  }}
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="totalTickets"
                  label="Total Tickets"
                  name="totalTickets"
                  type="number"
                  InputProps={{
                    inputProps: { min: 1 }
                  }}
                  value={totalTickets}
                  onChange={(e) => setTotalTickets(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ p: 1.5 }}
                  disabled={loading}
                >
                  Upload Event Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
              </Grid>
              {imagePreview && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: 2,
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Event preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                      }}
                    />
                  </Box>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Create Event'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CreateEvent;
