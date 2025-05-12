import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PersonIcon from '@mui/icons-material/Person';
import { getEventDetails, purchaseTicket } from '../utils/contracts';
import { ipfsToHTTP, createTicketMetadata } from '../utils/ipfs';

const EventDetails = ({ account }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventData = await getEventDetails(id);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handlePurchaseTicket = async () => {
    setPurchasing(true);
    setError('');

    try {
      // Create ticket metadata
      const tokenURI = await createTicketMetadata(
        id,
        event.name,
        event.imageURI
      );
      
      // Purchase ticket
      await purchaseTicket(id, tokenURI, event.ticketPrice);
      
      setPurchaseSuccess(true);
      
      // Refresh event details after purchase
      const updatedEvent = await getEventDetails(id);
      setEvent(updatedEvent);
      
      // Redirect to my tickets after 3 seconds
      setTimeout(() => {
        navigate('/my-tickets');
      }, 3000);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      setError(error.message || 'Failed to purchase ticket. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleBack = () => {
    navigate('/events');
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !event) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Events
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mt: 4, mb: 2 }}
      >
        Back to Events
      </Button>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        {!event.isActive && (
          <Alert severity="error" sx={{ mb: 3 }}>
            This event has been cancelled by the organizer.
          </Alert>
        )}

        {purchaseSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Ticket purchased successfully! You will be redirected to your tickets page.
          </Alert>
        )}

        {error && !purchaseSuccess && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={ipfsToHTTP(event.imageURI)}
              alt={event.name}
              style={{
                width: '100%',
                borderRadius: '8px',
                maxHeight: '300px',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Event+Image';
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {event.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip
                icon={<PersonIcon />}
                label={`Organizer: ${event.organizer.substring(0, 6)}...${event.organizer.substring(event.organizer.length - 4)}`}
                variant="outlined"
                sx={{ mr: 1 }}
              />
              <Chip
                icon={<ConfirmationNumberIcon />}
                label={`${event.availableTickets}/${event.totalTickets} available`}
                color={event.availableTickets > 0 ? 'success' : 'error'}
                variant="outlined"
              />
            </Box>
            
            <Typography variant="h5" color="primary" gutterBottom>
              {event.ticketPrice} ETH per ticket
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handlePurchaseTicket}
              disabled={
                purchasing ||
                parseInt(event.availableTickets) === 0 ||
                !event.isActive ||
                purchaseSuccess
              }
              sx={{ mb: 2 }}
            >
              {purchasing ? (
                <CircularProgress size={24} />
              ) : parseInt(event.availableTickets) === 0 ? (
                'Sold Out'
              ) : (
                'Purchase Ticket'
              )}
            </Button>
            
            {account === event.organizer && (
              <Alert severity="info" sx={{ mb: 2 }}>
                You are the organizer of this event.
              </Alert>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Event Description
            </Typography>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Event Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Total Tickets
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {event.totalTickets}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Available Tickets
                    </Typography>
                    <Typography variant="h4" color={parseInt(event.availableTickets) > 0 ? 'primary' : 'error'}>
                      {event.availableTickets}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Ticket Price
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {event.ticketPrice} ETH
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default EventDetails;
