// React is used implicitly for JSX
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EventIcon from '@mui/icons-material/Event';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import BlockIcon from '@mui/icons-material/Block';

const Home = ({ account }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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
    hidden: { y: 50, opacity: 0 },
    visible: i => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: i * 0.1
      }
    }),
    hover: {
      y: -15,
      boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.2)",
      scale: 1.03, // Slight scale effect
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        window.location.reload();
      } else {
        alert('Please install MetaMask to use this application');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            pt: { xs: 6, md: 10 },
            pb: 6,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div variants={itemVariants}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)'
                  : 'linear-gradient(45deg, #3f51b5 30%, #002984 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.05em',
                textShadow: theme.palette.mode === 'dark'
                  ? '0 0 25px rgba(63, 81, 181, 0.5)'
                  : 'none',
              }}
            >
              TICKETCHAIN
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6
              }}
            >
              A decentralized event ticketing platform that eliminates scalping and counterfeit tickets.
              Each ticket is a unique NFT with programmable transfer rules.
            </Typography>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Stack
              sx={{ pt: 2 }}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              {account ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/events')}
                  startIcon={<EventIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
                    boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                    transition: 'all 0.3s ease',
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
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  Explore Events
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={connectWallet}
                  startIcon={<AccountBalanceWalletIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #f50057 30%, #ff5983 90%)',
                    boxShadow: '0 3px 5px 2px rgba(245, 0, 87, .3)',
                    transition: 'all 0.3s ease',
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
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  Connect Wallet
                </Button>
              )}

              {account && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/create-event')}
                  startIcon={<LocalActivityIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  Create Event
                </Button>
              )}
            </Stack>
          </motion.div>

          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '5%',
              transform: 'translateY(-50%)',
              opacity: 0.1,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            >
              <ConfirmationNumberIcon sx={{ fontSize: 180, color: 'primary.main' }} />
            </motion.div>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: '30%',
              right: '5%',
              transform: 'translateY(-50%)',
              opacity: 0.1,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <motion.div
              animate={{
                rotate: [0, -360],
                y: [0, 10, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            >
              <QrCodeIcon sx={{ fontSize: 120, color: 'secondary.main' }} />
            </motion.div>
          </Box>
        </Box>

      {/* Features Section */}
      <Box sx={{ mt: 10, mb: 8 }}>
        <motion.div variants={itemVariants}>
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{
              mb: 6,
              fontWeight: 'bold',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '60px',
                height: '4px',
                bottom: '-10px',
                left: 'calc(50% - 30px)',
                backgroundColor: 'primary.main',
                borderRadius: '2px',
              }
            }}
          >
            Key Features
          </Typography>
        </motion.div>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[
            {
              icon: <ConfirmationNumberIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
              title: 'NFT Tickets',
              description: 'Each ticket is a unique NFT that can be easily verified and cannot be duplicated.',
              index: 0
            },
            {
              icon: <SecurityIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
              title: 'Anti-Scalping',
              description: 'Smart contract enforces rules to prevent ticket scalping and unauthorized resales.',
              index: 1
            },
            {
              icon: <VerifiedUserIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
              title: 'Verified Users',
              description: 'Only verified users can create events, ensuring legitimacy and trust.',
              index: 2
            },
            {
              icon: <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
              title: 'Blockchain Powered',
              description: 'Built on Ethereum, providing transparency, security, and immutability.',
              index: 3
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                custom={feature.index}
                variants={cardVariants}
                whileHover="hover"
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                      : '0 8px 16px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '150%',
                        height: '100%',
                        top: '-80%',
                        left: '-25%',
                        background: 'radial-gradient(ellipse at center, rgba(63, 81, 181, 0.2) 0%, rgba(63, 81, 181, 0) 70%)',
                        borderRadius: '50%',
                      }
                    }}
                  >
                    <motion.div
                      whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        color: 'primary.main'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      align="center"
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ mt: 12, mb: 10, position: 'relative' }}>
        <motion.div variants={itemVariants}>
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{
              mb: 8, // Increased bottom margin for better spacing
              fontWeight: 'bold',
              position: 'relative',
              display: 'inline-block',
              width: '100%', // Ensure full width for proper centering
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '60px',
                height: '4px',
                bottom: '-15px', // Adjusted position
                left: 'calc(50% - 30px)',
                backgroundColor: 'primary.main',
                borderRadius: '2px',
              }
            }}
          >
            How It Works
          </Typography>
        </motion.div>

        <Box sx={{ position: 'relative' }}>
          {/* Connecting line */}
          <Box
            sx={{
              position: 'absolute',
              top: '140px', // Adjusted to align with the center of the icons
              left: '20%', // Increased from edges for better appearance
              right: '20%',
              height: '3px',
              background: 'linear-gradient(90deg, rgba(63, 81, 181, 0.2), rgba(63, 81, 181, 0.8), rgba(63, 81, 181, 0.2))',
              zIndex: 0,
              display: { xs: 'none', md: 'block' },
              borderRadius: '4px',
              boxShadow: '0 0 10px rgba(63, 81, 181, 0.3)', // Added subtle glow
              maxWidth: '1000px',
              mx: 'auto',
            }}
          />

          <Grid container spacing={4} sx={{ mb: 8, position: 'relative', zIndex: 1, mt: 0, px: { xs: 2, md: 6 }, maxWidth: '1200px', mx: 'auto' }}>
            {[
              {
                number: '1',
                title: 'Register',
                description: 'Connect your wallet and register as a user. Admin will verify your account.',
                icon: <AccountBalanceWalletIcon fontSize="large" />, // Added fontSize prop
                index: 0
              },
              {
                number: '2',
                title: 'Create or Browse Events',
                description: 'Verified users can create events. All users can browse and purchase tickets.',
                icon: <EventIcon fontSize="large" />, // Added fontSize prop
                index: 1
              },
              {
                number: '3',
                title: 'Manage Tickets',
                description: 'View your tickets, transfer them to other registered users, or use them at events.',
                icon: <ConfirmationNumberIcon fontSize="large" />, // Added fontSize prop
                index: 2
              }
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  custom={step.index}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <Card
                    sx={{
                      height: '100%',
                      minHeight: '260px', // Adjusted minimum height
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                        : '0 8px 16px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      mt: 5, // Reduced margin top for icon
                      py: 3, // Increased vertical padding
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(145deg, #0a1929 0%, #132f4c 100%)'
                        : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center', // Changed to center
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '10px', // Fixed position instead of using transform
                        left: 'calc(50% - 20px)', // Center the 70px circle
                        width: '50px', // Smaller for better proportion
                        height: '50px', // Smaller for better proportion
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3f51b5 0%, #002984 100%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(63, 81, 181, 0.5)',
                        zIndex: 2,
                        border: '3px solid', // Thinner border
                        borderColor: theme.palette.mode === 'dark' ? '#0a1929' : 'white',
                        transition: 'all 0.3s ease',
                        overflow: 'visible', // Ensure icon is not clipped
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '5px',
                          left: '5px',
                          width: '15px',
                          height: '15px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.3)',
                          zIndex: 1
                        }
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.15, 1], // Increased scale for more noticeable effect
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        {/* Using number instead of icon for reliability */}
                        <Typography
                          variant="h5"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textShadow: '0 0 5px rgba(255, 255, 255, 0.9)',
                            fontSize: '1.8rem',
                            letterSpacing: '0.05em',
                            position: 'relative',
                            zIndex: 2
                          }}
                        >
                          {step.number}
                        </Typography>
                      </motion.div>
                    </Box>
                    <CardContent sx={{
                      pt: 3, // Further reduced top padding
                      pb: 4, // Bottom padding
                      px: 3, // Reduced horizontal padding
                      mt: 2, // Further reduced top margin
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center', // Ensure text is centered
                      '& > *': { // Apply to all direct children
                        width: '100%', // Full width for proper alignment
                      }
                    }}>
                      <Typography
                        variant="h5"
                        component="div"
                        gutterBottom
                        align="center"
                        sx={{
                          fontWeight: 'bold',
                          color: theme.palette.mode === 'dark' ? '#90caf9' : 'primary.main', // Brighter blue in dark mode
                          mb: 2, // Reduced margin bottom
                          position: 'relative',
                          fontSize: '1.4rem', // Slightly smaller for better fit
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '30px', // Shorter line
                            height: '2px', // Thinner line
                            bottom: '-8px',
                            left: 'calc(50% - 15px)',
                            backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : 'primary.main',
                            opacity: 0.7,
                            borderRadius: '2px',
                          }
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={theme.palette.mode === 'dark' ? 'text.primary' : 'text.secondary'}
                        align="center"
                        sx={{
                          lineHeight: 1.6, // Slightly reduced line height
                          maxWidth: '85%', // Slightly more constrained width
                          mx: 'auto', // Center the constrained text
                          fontSize: '0.9rem', // Slightly smaller font
                          mt: 1 // Add a bit of top margin
                        }}
                      >
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to action */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mt: 6,
              borderRadius: 3,
              textAlign: 'center',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Ready to experience the future of event ticketing?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
              Join TicketChain today and discover a secure, transparent, and user-friendly way to buy, sell, and manage event tickets.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={account ? () => navigate('/events') : connectWallet}
              startIcon={account ? <EventIcon /> : <AccountBalanceWalletIcon />}
              sx={{
                px: 4,
                py: 1.5,
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
              {account ? 'Explore Events' : 'Connect Wallet'}
            </Button>
          </Paper>
        </motion.div>
      </Box>
      </Container>
    </motion.div>
  );
};

export default Home;
