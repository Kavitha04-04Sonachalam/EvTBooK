import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
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
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const Home = ({ account }) => {
  const navigate = useNavigate();

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
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          pt: 8,
          pb: 6,
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          TICKETCHAIN
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          A decentralized event ticketing platform that eliminates scalping and counterfeit tickets.
          Each ticket is a unique NFT with programmable transfer rules.
        </Typography>
        <Stack
          sx={{ pt: 4 }}
          direction="row"
          spacing={2}
          justifyContent="center"
        >
          {account ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/events')}
            >
              Explore Events
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={connectWallet}
              startIcon={<AccountBalanceWalletIcon />}
            >
              Connect Wallet
            </Button>
          )}
        </Stack>
      </Box>

      {/* Features Section */}
      <Typography
        component="h2"
        variant="h3"
        align="center"
        color="text.primary"
        gutterBottom
        sx={{ mt: 8, mb: 4 }}
      >
        Key Features
      </Typography>
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-10px)',
              },
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <ConfirmationNumberIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                NFT Tickets
              </Typography>
              <Typography align="center">
                Each ticket is a unique NFT that can be easily verified and cannot be duplicated.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-10px)',
              },
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <SecurityIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Anti-Scalping
              </Typography>
              <Typography align="center">
                Smart contract enforces rules to prevent ticket scalping and unauthorized resales.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-10px)',
              },
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <VerifiedUserIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Verified Users
              </Typography>
              <Typography align="center">
                Only verified users can create events, ensuring legitimacy and trust.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-10px)',
              },
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Blockchain Powered
              </Typography>
              <Typography align="center">
                Built on Ethereum, providing transparency, security, and immutability.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* How It Works Section */}
      <Typography
        component="h2"
        variant="h3"
        align="center"
        color="text.primary"
        gutterBottom
        sx={{ mt: 8, mb: 4 }}
      >
        How It Works
      </Typography>
      <Grid container spacing={2} sx={{ mb: 8 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom align="center">
                1. Register
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Connect your wallet and register as a user. Admin will verify your account.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom align="center">
                2. Create or Browse Events
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Verified users can create events. All users can browse and purchase tickets.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom align="center">
                3. Manage Tickets
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                View your tickets, transfer them to other registered users, or use them at events.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
