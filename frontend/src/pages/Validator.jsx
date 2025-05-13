import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Alert,
  CircularProgress,
  Fade,
  Chip,
  IconButton,
  Tooltip,
  Zoom,
  Backdrop,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventIcon from '@mui/icons-material/Event';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { verifyTicket, useTicket, getEventTicketingContract } from '../utils/contracts';
import { ipfsToHTTP } from '../utils/ipfs';
import { QRCodeSVG } from 'qrcode.react';

const Validator = ({ account }) => {
  const [ticketId, setTicketId] = useState('');
  const [ticketOwner, setTicketOwner] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [markingAsUsed, setMarkingAsUsed] = useState(false);
  const scannerRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    // Clean up scanner when component unmounts
    return () => {
      if (qrScannerRef.current) {
        try {
          qrScannerRef.current.clear();
          console.log("QR scanner cleared on unmount");
        } catch (error) {
          console.error("Error clearing QR scanner:", error);
        }
      }
    };
  }, []);

  // Reset error when ticket ID or owner changes
  useEffect(() => {
    if (ticketId || ticketOwner) {
      setError('');
    }
  }, [ticketId, ticketOwner]);

  const handleStartScanner = () => {
    setScannerActive(true);
    setError('');
    setValidationResult(null);
    setTicketDetails(null);

    // Clear previous scanner instance
    if (qrScannerRef.current) {
      try {
        qrScannerRef.current.clear();
        console.log("Previous scanner cleared");
      } catch (error) {
        console.error("Error clearing previous scanner:", error);
      }
    }

    // Reset ticket fields
    setTicketId('');
    setTicketOwner('');

    // Add a small delay before initializing the scanner to ensure DOM is ready
    setTimeout(() => {
      try {
        // Initialize scanner with optimized settings
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true,
            defaultZoomValueIfSupported: 2,
          },
          /* verbose= */ false
        );

        const onScanSuccess = async (decodedText) => {
          console.log("QR code scanned successfully:", decodedText);
          try {
            // Parse the QR code data
            const data = JSON.parse(decodedText);
            console.log("Parsed QR data:", data);

            if (data && data.ticketId && data.owner) {
              setTicketId(data.ticketId);
              setTicketOwner(data.owner);

              // Stop scanner after successful scan
              try {
                scanner.clear();
                console.log("Scanner cleared after successful scan");
                qrScannerRef.current = null;
                setScannerActive(false);
              } catch (clearError) {
                console.error("Error clearing scanner after scan:", clearError);
              }

              // Validate the ticket
              await handleValidateTicket(data.ticketId, data.owner);
            } else {
              setError('Invalid QR code format: Missing ticket ID or owner information');
              console.error('Invalid QR data structure:', data);
            }
          } catch (parseError) {
            console.error('Error parsing QR code:', parseError);
            setError('Could not parse QR code. Please make sure you are scanning a valid ticket QR code.');
          }
        };

        const onScanFailure = (error) => {
          // We don't need to show errors for each failed scan attempt
          // Only log for debugging purposes
          console.log(`QR scan error: ${error}`);
        };

        scanner.render(onScanSuccess, onScanFailure);
        qrScannerRef.current = scanner;
        console.log("QR scanner initialized");
      } catch (initError) {
        console.error("Error initializing QR scanner:", initError);
        setError("Failed to start QR scanner. Please try again or enter ticket details manually.");
        setScannerActive(false);
      }
    }, 300);
  };

  const handleStopScanner = () => {
    if (qrScannerRef.current) {
      try {
        qrScannerRef.current.clear();
        console.log("Scanner stopped by user");
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
      qrScannerRef.current = null;
    }
    setScannerActive(false);
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const contract = await getEventTicketingContract();
      const ticketDetails = await contract.getTicketDetails(ticketId);
      const eventDetails = await contract.getEventDetails(ticketDetails[0]);

      return {
        id: ticketId,
        eventId: ticketDetails[0].toString(),
        eventName: eventDetails[0],
        owner: ticketDetails[1],
        isUsed: ticketDetails[2],
        imageURI: eventDetails[2]
      };
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      throw new Error('Failed to fetch ticket details');
    }
  };

  const handleValidateTicket = async (id = ticketId, owner = ticketOwner) => {
    if (!id || !owner) {
      setError('Please enter both ticket ID and owner address');
      return;
    }

    setLoading(true);
    setError('');
    setValidationResult(null);
    setTicketDetails(null);

    try {
      // Verify the ticket
      const isValid = await verifyTicket(id, owner);

      // Get ticket details
      const details = await fetchTicketDetails(id);
      setTicketDetails(details);

      setValidationResult(isValid);
    } catch (error) {
      console.error('Error validating ticket:', error);
      setError(error.message || 'Failed to validate ticket. Please try again.');
      setValidationResult(false);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsUsed = async () => {
    if (!ticketId) {
      setError('No ticket selected');
      return;
    }

    setMarkingAsUsed(true);
    setError('');

    try {
      // Mark ticket as used
      await useTicket(ticketId);

      // Update ticket details
      const details = await fetchTicketDetails(ticketId);
      setTicketDetails(details);

      // Show success message
      setValidationResult(false); // Now invalid because it's used
    } catch (error) {
      console.error('Error marking ticket as used:', error);
      setError(error.message || 'Failed to mark ticket as used. Please try again.');
    } finally {
      setMarkingAsUsed(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 4, pb: 2 }}>
        <Typography component="h1" variant="h3" gutterBottom>
          Ticket Validator
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Scan or enter ticket details to validate tickets for your events
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Validate Ticket
            </Typography>

            {!scannerActive ? (
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<QrCodeScannerIcon />}
                  onClick={handleStartScanner}
                  fullWidth
                  sx={{
                    mb: 2,
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
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  Scan QR Code
                </Button>

                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  or enter details manually
                </Typography>

                <TextField
                  label="Ticket ID"
                  variant="outlined"
                  fullWidth
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Owner Address"
                  variant="outlined"
                  fullWidth
                  value={ticketOwner}
                  onChange={(e) => setTicketOwner(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  onClick={() => handleValidateTicket()}
                  disabled={loading || !ticketId || !ticketOwner}
                  fullWidth
                  startIcon={loading ? null : <VerifiedIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #4caf50 30%, #80e27e 90%)',
                    boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Validate'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ mb: 3 }}>
                <Box
                  id="qr-reader"
                  sx={{
                    width: '100%',
                    maxWidth: '500px',
                    margin: '0 auto',
                    '& video': { borderRadius: 2 },
                    '& section': { position: 'relative' },
                    '& section div:first-of-type': { border: '3px solid #3f51b5 !important', borderRadius: '8px !important' },
                    '& button': { borderRadius: '4px !important' },
                    '& select': { padding: '8px !important', borderRadius: '4px !important' },
                    '& span.dbrScanner-result': { display: 'none !important' }
                  }}
                />
                {error && (
                  <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleStopScanner}
                  fullWidth
                  sx={{
                    mt: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.08)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                  startIcon={<CancelIcon />}
                >
                  Cancel Scanning
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Validation Result
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : validationResult !== null ? (
              <Fade in={validationResult !== null}>
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      p: 2,
                      bgcolor: validationResult ? 'success.dark' : 'error.dark',
                      borderRadius: 2,
                      color: 'white'
                    }}
                  >
                    {validationResult ? (
                      <>
                        <VerifiedIcon sx={{ fontSize: 40, mr: 1 }} />
                        <Typography variant="h5">Ticket Valid</Typography>
                      </>
                    ) : (
                      <>
                        <CancelIcon sx={{ fontSize: 40, mr: 1 }} />
                        <Typography variant="h5">Ticket Invalid</Typography>
                      </>
                    )}
                  </Box>

                  {ticketDetails && (
                    <Card sx={{ mb: 3 }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={ipfsToHTTP(ticketDetails.imageURI)}
                        alt={ticketDetails.eventName}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
                        }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {ticketDetails.eventName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Ticket ID: {ticketDetails.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Event ID: {ticketDetails.eventId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Owner: {`${ticketDetails.owner.substring(0, 6)}...${ticketDetails.owner.substring(ticketDetails.owner.length - 4)}`}
                        </Typography>
                        <Chip
                          label={ticketDetails.isUsed ? 'Used' : 'Valid'}
                          color={ticketDetails.isUsed ? 'error' : 'success'}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {validationResult && !ticketDetails?.isUsed && (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<CheckCircleIcon />}
                      onClick={handleMarkAsUsed}
                      disabled={markingAsUsed}
                      fullWidth
                    >
                      {markingAsUsed ? <CircularProgress size={24} /> : 'Mark as Used'}
                    </Button>
                  )}
                </Box>
              </Fade>
            ) : (
              <Box sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
                <QrCodeScannerIcon sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
                <Typography>
                  Scan a ticket QR code or enter ticket details to see validation results
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Validator;
