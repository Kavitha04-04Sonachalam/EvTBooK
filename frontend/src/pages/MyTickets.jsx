import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Paper,
  Fade,
  Skeleton,
  Tooltip,
  Zoom,
  IconButton,
  Backdrop,
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import EventIcon from '@mui/icons-material/Event';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VerifiedIcon from '@mui/icons-material/Verified';
import { getUserTickets, getEventTicketingContract } from '../utils/contracts';
import { ipfsToHTTP } from '../utils/ipfs';
import { ethers } from 'ethers';
import { QRCodeSVG } from 'qrcode.react';

const MyTickets = ({ account }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [openQrDialog, setOpenQrDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [transferAddress, setTransferAddress] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [qrDownloading, setQrDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const userTickets = await getUserTickets(account);
        setTickets(userTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [account]);

  const handleTransferClick = (ticket) => {
    setSelectedTicket(ticket);
    setTransferAddress('');
    setTransferError('');
    setOpenTransferDialog(true);
  };

  const handleCloseTransferDialog = () => {
    setOpenTransferDialog(false);
    setSelectedTicket(null);
  };

  const handleTransferTicket = async () => {
    setTransferring(true);
    setTransferError('');

    try {
      // Validate address
      if (!ethers.utils.isAddress(transferAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      // Get contract
      const contract = await getEventTicketingContract();

      // Approve transfer
      const approveTx = await contract.approve(transferAddress, selectedTicket.id);
      await approveTx.wait();

      // Transfer ticket
      const transferTx = await contract.transferFrom(account, transferAddress, selectedTicket.id);
      await transferTx.wait();

      // Close dialog
      handleCloseTransferDialog();

      // Refresh tickets
      const userTickets = await getUserTickets(account);
      setTickets(userTickets);
    } catch (error) {
      console.error('Error transferring ticket:', error);
      setTransferError(error.message || 'Failed to transfer ticket. Please try again.');
    } finally {
      setTransferring(false);
    }
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleShowQrCode = (ticket) => {
    setSelectedTicket(ticket);
    setOpenQrDialog(true);
  };

  const handleCloseQrDialog = () => {
    setOpenQrDialog(false);
    setTimeout(() => setSelectedTicket(null), 300); // Delay to allow dialog animation to complete
  };

  const handleDownloadQrCode = () => {
    if (!selectedTicket) return;

    setQrDownloading(true);

    try {
      const svgElement = document.getElementById('ticket-qr-code');
      if (!svgElement) {
        throw new Error('QR code SVG not found');
      }

      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions with padding for better scanning
      const padding = 20; // Add padding around the QR code
      canvas.width = 250 + (padding * 2);
      canvas.height = 250 + (padding * 2);

      // Create an image from the SVG
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Draw white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the QR code with padding
        ctx.drawImage(img, padding, padding, 250, 250);

        // Add ticket information text at the bottom
        ctx.fillStyle = 'black';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Ticket ID: ${selectedTicket.id}`, canvas.width / 2, canvas.height - 5);

        // Add border for better scanning
        ctx.strokeStyle = '#3f51b5';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

        // Convert canvas to PNG
        const pngUrl = canvas.toDataURL('image/png');

        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `ticket-${selectedTicket.id}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Clean up
        URL.revokeObjectURL(url);
        setQrDownloading(false);
      };

      img.onerror = (error) => {
        console.error('Error loading QR code image:', error);
        setQrDownloading(false);
      };

      img.src = url;
    } catch (error) {
      console.error('Error downloading QR code:', error);
      setQrDownloading(false);
    }
  };

  const handleShareQrCode = async () => {
    if (!selectedTicket || !navigator.share) return;

    try {
      // Create a text to share instead of the image since SVG sharing is complex
      await navigator.share({
        title: `Ticket for ${selectedTicket.eventName}`,
        text: `My ticket for ${selectedTicket.eventName} (ID: ${selectedTicket.id})`,
      });
    } catch (error) {
      console.error('Error sharing ticket info:', error);
      // If sharing fails, fall back to download
      if (error.name !== 'AbortError') {
        handleDownloadQrCode();
      }
    }
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

  const ticketVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: 90, y: 50 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      rotateY: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.1
      }
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    flip: {
      rotateY: [0, 180, 0],
      transition: {
        duration: 1.5,
        ease: "easeInOut"
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
            <Typography
              component="h1"
              variant="h3"
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              My Tickets
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage your purchased tickets
            </Typography>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Divider sx={{ mb: 4 }} />
        </motion.div>

        {loading ? (
          <Box sx={{ my: 4 }}>
            <Grid container spacing={4}>
              {[1, 2, 3].map((item) => (
                <Grid item key={item} xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <Skeleton variant="rectangular" height={200} animation="wave" />
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Skeleton variant="text" height={40} width="60%" animation="wave" />
                        <Skeleton variant="rectangular" height={24} width="20%" animation="wave" sx={{ borderRadius: 16 }} />
                      </Box>
                      <Skeleton variant="text" height={20} animation="wave" />
                      <Skeleton variant="text" height={20} animation="wave" />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <Skeleton variant="rectangular" height={36} width="45%" animation="wave" sx={{ borderRadius: 1 }} />
                      <Skeleton variant="rectangular" height={36} width="45%" animation="wave" sx={{ borderRadius: 1 }} />
                    </CardActions>
                    <Box sx={{ px: 2, pb: 2 }}>
                      <Skeleton variant="rectangular" height={36} width="100%" animation="wave" sx={{ borderRadius: 1 }} />
                    </Box>
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
        ) : tickets.length === 0 ? (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <Box sx={{ textAlign: 'center', my: 8 }}>
              <motion.div
                animate={{
                  rotateZ: [0, 10, -10, 10, 0],
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <ConfirmationNumberIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              </motion.div>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No tickets found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                You haven't purchased any tickets yet.
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
                  onClick={() => navigate('/events')}
                  startIcon={<EventIcon />}
                  sx={{
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
                      boxShadow: '0 6px 10px 4px rgba(63, 81, 181, .3)',
                    },
                  }}
                >
                  Browse Events
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        ) : (
          <Grid container spacing={4}>
            <AnimatePresence>
              {tickets.map((ticket, index) => (
                <Grid item key={ticket.id} xs={12} sm={6} md={4}>
                  <motion.div
                    custom={index}
                    variants={ticketVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    layoutId={`ticket-${ticket.id}`}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)',
                      }}
                    >
                      {ticket.isUsed && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          style={{ zIndex: 2 }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              bgcolor: 'rgba(0, 0, 0, 0.7)',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              zIndex: 1,
                            }}
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                rotate: [-5, 0, 5, 0, -5],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "loop",
                              }}
                            >
                              <Typography
                                variant="h4"
                                sx={{
                                  color: 'white',
                                  transform: 'rotate(-30deg)',
                                  border: '5px solid white',
                                  padding: '10px 20px',
                                  borderRadius: '10px',
                                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                  boxShadow: '0 0 20px rgba(244, 67, 54, 0.7)',
                                }}
                              >
                                USED
                              </Typography>
                            </motion.div>
                          </Box>
                        </motion.div>
                      )}
                      <CardMedia
                        component="img"
                        height="200"
                        image={ipfsToHTTP(ticket.imageURI)}
                        alt={ticket.eventName}
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                            {ticket.eventName}
                          </Typography>
                          <Tooltip
                            title={ticket.isUsed ? "This ticket has been used" : "This ticket is valid for entry"}
                            arrow
                            TransitionComponent={Zoom}
                          >
                            <Chip
                              icon={ticket.isUsed ? null : <VerifiedIcon />}
                              label={ticket.isUsed ? 'Used' : 'Valid'}
                              color={ticket.isUsed ? 'error' : 'success'}
                              size="small"
                              sx={{
                                '& .MuiChip-icon': {
                                  animation: !ticket.isUsed ? 'pulse 2s infinite' : 'none',
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
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <span style={{ fontWeight: 'bold' }}>Ticket ID:</span> {ticket.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <span style={{ fontWeight: 'bold' }}>Event ID:</span> {ticket.eventId}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                        <Tooltip title="Show QR Code for entry" arrow>
                          <span>
                            <motion.div
                              whileHover={!ticket.isUsed ? { scale: 1.05, y: -3 } : {}}
                              whileTap={!ticket.isUsed ? { scale: 0.95 } : {}}
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<QrCodeIcon />}
                                disabled={ticket.isUsed}
                                onClick={() => handleShowQrCode(ticket)}
                                sx={{
                                  transition: 'all 0.3s ease',
                                  '&:not(:disabled):hover': {
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                  },
                                }}
                              >
                                Show QR
                              </Button>
                            </motion.div>
                          </span>
                        </Tooltip>
                        <Tooltip title="Transfer ticket to another user" arrow>
                          <span>
                            <motion.div
                              whileHover={!ticket.isUsed ? { scale: 1.05, y: -3 } : {}}
                              whileTap={!ticket.isUsed ? { scale: 0.95 } : {}}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<SwapHorizIcon />}
                                onClick={() => handleTransferClick(ticket)}
                                disabled={ticket.isUsed}
                                sx={{
                                  background: !ticket.isUsed ? 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)' : 'grey',
                                  transition: 'all 0.3s ease',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&::after': !ticket.isUsed ? {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                    transition: 'all 0.5s',
                                  } : {},
                                  '&:hover::after': !ticket.isUsed ? {
                                    left: '100%',
                                  } : {},
                                  '&:not(:disabled):hover': {
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                  },
                                }}
                              >
                                Transfer
                              </Button>
                            </motion.div>
                          </span>
                        </Tooltip>
                      </CardActions>
                      <motion.div
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          size="small"
                          fullWidth
                          onClick={() => handleViewEvent(ticket.eventId)}
                          startIcon={<EventIcon />}
                          sx={{
                            mt: 'auto',
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            py: 1,
                            background: 'rgba(63, 81, 181, 0.1)',
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
                              background: 'rgba(63, 81, 181, 0.2)',
                            },
                          }}
                        >
                          View Event
                        </Button>
                      </motion.div>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </motion.div>

      {/* Transfer Dialog */}
      <Dialog open={openTransferDialog} onClose={handleCloseTransferDialog}>
        <DialogTitle>Transfer Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the Ethereum address of the recipient. The recipient must be a registered user.
          </DialogContentText>
          {transferError && (
            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
              {transferError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Recipient Address"
            type="text"
            fullWidth
            variant="outlined"
            value={transferAddress}
            onChange={(e) => setTransferAddress(e.target.value)}
            disabled={transferring}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTransferDialog} disabled={transferring}>
            Cancel
          </Button>
          <Button
            onClick={handleTransferTicket}
            variant="contained"
            disabled={!transferAddress || transferring}
          >
            {transferring ? <CircularProgress size={24} /> : 'Transfer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog
        open={openQrDialog}
        onClose={handleCloseQrDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={500}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)',
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
          color: 'white',
          textAlign: 'center',
          py: 2,
        }}>
          <ConfirmationNumberIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Ticket QR Code
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {selectedTicket.eventName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Ticket ID: <span style={{ fontWeight: 'bold' }}>{selectedTicket.id}</span>
                </Typography>

                <motion.div
                  whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      p: 3,
                      mt: 2,
                      mb: 3,
                      borderRadius: 2,
                      background: 'white',
                      border: '5px solid #3f51b5',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 'fit-content',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        background: 'linear-gradient(45deg, #3f51b5, #757de8, #3f51b5)',
                        zIndex: -1,
                        borderRadius: 3,
                        animation: 'rotate 3s linear infinite',
                        '@keyframes rotate': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }
                    }}
                  >
                    <QRCodeSVG
                      id="ticket-qr-code"
                      value={JSON.stringify({
                        ticketId: selectedTicket.id,
                        owner: account,
                        eventId: selectedTicket.eventId,
                        timestamp: new Date().toISOString()
                      })}
                      size={250}
                      level="H"
                      includeMargin={true}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      // Improved QR code settings for better scanning
                      quietZone={10}
                      style={{
                        display: 'block',
                        margin: '0 auto',
                        maxWidth: '100%',
                        height: 'auto'
                      }}
                    />
                  </Paper>
                </motion.div>

                <Box sx={{
                  p: 2,
                  bgcolor: 'rgba(63, 81, 181, 0.1)',
                  borderRadius: 2,
                  textAlign: 'center',
                  border: '1px dashed #3f51b5',
                  maxWidth: '90%',
                  mx: 'auto',
                }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Present this QR code at the event for entry. This code contains your ticket information and ownership details.
                    <br />
                    <span style={{ fontWeight: 'bold', color: '#f44336' }}>Do not share this QR code with others!</span>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadQrCode}
                      disabled={qrDownloading}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
                        boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
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
                      {qrDownloading ? <CircularProgress size={24} /> : 'Download'}
                    </Button>
                  </motion.div>

                  {navigator.share && (
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<ShareIcon />}
                        onClick={handleShareQrCode}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          borderWidth: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'rgba(63, 81, 181, 0.05)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        Share
                      </Button>
                    </motion.div>
                  )}
                </Box>
              </Box>
            </motion.div>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Button
              onClick={handleCloseQrDialog}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(63, 81, 181, 0.05)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Close
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyTickets;
