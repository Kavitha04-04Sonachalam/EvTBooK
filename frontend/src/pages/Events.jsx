import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { getAllEvents } from '../utils/contracts';
import { ipfsToHTTP } from '../utils/ipfs';

const Events = ({ account }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getAllEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 4, pb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography component="h1" variant="h3" gutterBottom>
              Events
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse all available events and purchase tickets
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateEvent}
              size="large"
            >
              Create Event
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : events.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Be the first to create an event!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateEvent}
          >
            Create Event
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={ipfsToHTTP(event.imageURI)}
                  alt={event.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {event.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      mb: 2,
                    }}
                  >
                    {event.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="primary">
                      {event.ticketPrice} ETH
                    </Typography>
                    <Chip
                      icon={<ConfirmationNumberIcon />}
                      label={`${event.availableTickets}/${event.totalTickets} available`}
                      color={event.availableTickets > 0 ? 'success' : 'error'}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    fullWidth
                    variant="contained"
                    onClick={() => handleViewEvent(event.id)}
                    disabled={!event.isActive}
                  >
                    View Details
                  </Button>
                </CardActions>
                {!event.isActive && (
                  <Box sx={{ bgcolor: 'error.main', color: 'white', p: 1, textAlign: 'center' }}>
                    <Typography variant="body2">Event Cancelled</Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Events;
