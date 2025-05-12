import { useState, useEffect, useRef } from 'react';
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
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
    return () => {
      // Clean up scanner when component unmounts
      if (qrScannerRef.current) {
        qrScannerRef.current.clear();
      }
    };
  }, []);

  const handleStartScanner = () => {
    setScannerActive(true);
    setError('');

    // Clear previous scanner instance
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
    }

    // Initialize scanner with a smaller viewfinder and higher FPS
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      /* verbose= */ false
    );

    const onScanSuccess = async (decodedText) => {
      try {
        // Parse the QR code data
        const data = JSON.parse(decodedText);
        if (data.ticketId && data.owner) {
          setTicketId(data.ticketId);
          setTicketOwner(data.owner);

          // Stop scanner after successful scan
          scanner.clear();
          qrScannerRef.current = null;
          setScannerActive(false);

          // Validate the ticket
          await handleValidateTicket(data.ticketId, data.owner);
        } else {
          setError('Invalid QR code format');
        }
      } catch (error) {
        console.error('Error parsing QR code:', error);
        setError('Invalid QR code format. Please try again.');
      }
    };

    const onScanFailure = (error) => {
      // We don't need to show errors for each failed scan attempt
      console.log(`QR scan error: ${error}`);
    };

    scanner.render(onScanSuccess, onScanFailure);
    qrScannerRef.current = scanner;
  };

  const handleStopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
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
                  sx={{ mb: 2 }}
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
                    '& video': { borderRadius: 2 }
                  }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleStopScanner}
                  fullWidth
                  sx={{ mt: 2 }}
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
