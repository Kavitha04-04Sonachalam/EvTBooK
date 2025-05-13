import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Skeleton,
  Tooltip,
  Zoom,
  Fade,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Button animation variants
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <Container maxWidth="lg">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
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
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateEvent}
                    size="large"
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'all 0.5s',
                      },
                      '&:hover::after': {
                        left: '100%',
                      },
                    }}
                  >
                    Create Event
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Divider sx={{ mb: 4 }} />
        </motion.div>

        {loading ? (
          <Box sx={{ my: 4 }}>
            <Grid container spacing={4}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid item key={item} xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <Skeleton variant="rectangular" height={200} animation="wave" />
                    <CardContent>
                      <Skeleton variant="text" height={40} width="80%" animation="wave" />
                      <Skeleton variant="text" height={20} animation="wave" />
                      <Skeleton variant="text" height={20} animation="wave" />
                      <Skeleton variant="text" height={20} width="60%" animation="wave" />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Skeleton variant="text" height={30} width="30%" animation="wave" />
                        <Skeleton variant="rectangular" height={30} width="40%" animation="wave" sx={{ borderRadius: 1 }} />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Skeleton variant="rectangular" height={36} width="100%" animation="wave" sx={{ borderRadius: 1 }} />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : error ? (
          <motion.div variants={itemVariants}>
            <Alert
              severity="error"
              sx={{
                my: 2,
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.4)' },
                  '70%': { boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)' },
                }
              }}
            >
              {error}
            </Alert>
          </motion.div>
        ) : events.length === 0 ? (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <Box sx={{ textAlign: 'center', my: 8 }}>
              <motion.div
                animate={{
                  rotateY: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }}
              >
                <EventIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              </motion.div>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No events found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Be the first to create an event!
              </Typography>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.5,
                    type: "spring",
                    stiffness: 200
                  }
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateEvent}
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
                    boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                  }}
                >
                  Create Event
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        ) : (
          <>
            <Grid container spacing={4}>
              {events.map((event, index) => (
                <Grid item key={event.id} xs={12} sm={6} md={4}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
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
                        sx={{
                          transition: 'transform 0.5s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="h2"
                          sx={{
                            background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                          }}
                        >
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
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{
                              fontWeight: 'bold',
                              textShadow: '0px 0px 5px rgba(63, 81, 181, 0.3)',
                            }}
                          >
                            {event.ticketPrice} ETH
                          </Typography>
                          <Tooltip
                            title={event.availableTickets > 0 ? "Tickets available" : "Sold out"}
                            arrow
                            TransitionComponent={Zoom}
                          >
                            <Chip
                              icon={<ConfirmationNumberIcon />}
                              label={`${event.availableTickets}/${event.totalTickets} available`}
                              color={event.availableTickets > 0 ? 'success' : 'error'}
                              variant="outlined"
                              size="small"
                              sx={{
                                '& .MuiChip-icon': {
                                  animation: event.availableTickets > 0 ? 'pulse 2s infinite' : 'none',
                                  '@keyframes pulse': {
                                    '0%': { transform: 'scale(1)' },
                                    '50%': { transform: 'scale(1.2)' },
                                    '100%': { transform: 'scale(1)' },
                                  },
                                },
                              }}
                            />
                          </Tooltip>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <motion.div
                          whileHover={event.isActive ? { scale: 1.03 } : {}}
                          whileTap={event.isActive ? { scale: 0.97 } : {}}
                        >
                          <Button
                            size="small"
                            fullWidth
                            variant="contained"
                            onClick={() => handleViewEvent(event.id)}
                            disabled={!event.isActive}
                            startIcon={<SearchIcon />}
                            sx={{
                              background: event.isActive ? 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)' : 'grey',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::after': event.isActive ? {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                transition: 'all 0.5s',
                              } : {},
                              '&:hover::after': event.isActive ? {
                                left: '100%',
                              } : {},
                              '&:hover': {
                                transform: event.isActive ? 'translateY(-3px)' : 'none',
                                boxShadow: event.isActive ? '0 6px 10px rgba(0, 0, 0, 0.3)' : 'none',
                              },
                            }}
                          >
                            View Details
                          </Button>
                        </motion.div>
                      </CardActions>
                      {!event.isActive && (
                        <Fade in={!event.isActive}>
                          <Box
                            sx={{
                              bgcolor: 'error.main',
                              color: 'white',
                              p: 1,
                              textAlign: 'center',
                              position: 'absolute',
                              top: '10px',
                              right: '0',
                              transform: 'rotate(45deg) translateX(20px)',
                              width: '200px',
                              boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <Typography variant="body2" fontWeight="bold">Event Cancelled</Typography>
                          </Box>
                        </Fade>
                      )}
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default Events;
