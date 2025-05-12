import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
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

      // Set canvas dimensions
      canvas.width = 250;
      canvas.height = 250;

      // Create an image from the SVG
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Draw the image on the canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 4, pb: 2 }}>
        <Typography component="h1" variant="h3" gutterBottom>
          My Tickets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your purchased tickets
        </Typography>
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
      ) : tickets.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <ConfirmationNumberIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No tickets found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't purchased any tickets yet.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/events')}
          >
            Browse Events
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {tickets.map((ticket) => (
            <Grid item key={ticket.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {ticket.isUsed && (
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
                    <Typography
                      variant="h4"
                      sx={{
                        color: 'white',
                        transform: 'rotate(-30deg)',
                        border: '5px solid white',
                        padding: '10px 20px',
                        borderRadius: '10px',
                      }}
                    >
                      USED
                    </Typography>
                  </Box>
                )}
                <CardMedia
                  component="img"
                  height="200"
                  image={ipfsToHTTP(ticket.imageURI)}
                  alt={ticket.eventName}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {ticket.eventName}
                    </Typography>
                    <Chip
                      label={ticket.isUsed ? 'Used' : 'Valid'}
                      color={ticket.isUsed ? 'error' : 'success'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ticket ID: {ticket.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Event ID: {ticket.eventId}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<QrCodeIcon />}
                    disabled={ticket.isUsed}
                    onClick={() => handleShowQrCode(ticket)}
                  >
                    Show QR
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleTransferClick(ticket)}
                    disabled={ticket.isUsed}
                  >
                    Transfer
                  </Button>
                </CardActions>
                <Button
                  size="small"
                  fullWidth
                  onClick={() => handleViewEvent(ticket.eventId)}
                  sx={{ mt: 'auto' }}
                >
                  View Event
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          Ticket QR Code
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedTicket.eventName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ticket ID: {selectedTicket.id}
              </Typography>

              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  mt: 2,
                  mb: 3,
                  borderRadius: 2,
                  background: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 'fit-content'
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
                />
              </Paper>

              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                Present this QR code at the event for entry. This code contains your ticket information and ownership details.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadQrCode}
                  disabled={qrDownloading}
                >
                  {qrDownloading ? <CircularProgress size={24} /> : 'Download'}
                </Button>

                {navigator.share && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ShareIcon />}
                    onClick={handleShareQrCode}
                  >
                    Share
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQrDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyTickets;
