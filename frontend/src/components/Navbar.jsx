import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const Navbar = ({ account, isRegistered }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for larger screens */}
          <ConfirmationNumberIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TICKETCHAIN
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {isRegistered && (
                [
                  <MenuItem key="events" onClick={() => { handleCloseNavMenu(); navigate('/events'); }}>
                    <Typography textAlign="center">Events</Typography>
                  </MenuItem>,
                  <MenuItem key="create-event" onClick={() => { handleCloseNavMenu(); navigate('/create-event'); }}>
                    <Typography textAlign="center">Create Event</Typography>
                  </MenuItem>,
                  <MenuItem key="my-tickets" onClick={() => { handleCloseNavMenu(); navigate('/my-tickets'); }}>
                    <Typography textAlign="center">My Tickets</Typography>
                  </MenuItem>,
                  <MenuItem key="admin" onClick={() => { handleCloseNavMenu(); navigate('/admin'); }}>
                    <Typography textAlign="center">Admin</Typography>
                  </MenuItem>,
                  <MenuItem key="validator" onClick={() => { handleCloseNavMenu(); navigate('/validator'); }}>
                    <Typography textAlign="center">Validator</Typography>
                  </MenuItem>
                ]
              )}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <ConfirmationNumberIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TICKETCHAIN
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {isRegistered && (
              <>
                <Button
                  component={RouterLink}
                  to="/events"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Events
                </Button>
                <Button
                  component={RouterLink}
                  to="/create-event"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Create Event
                </Button>
                <Button
                  component={RouterLink}
                  to="/my-tickets"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  My Tickets
                </Button>
                <Button
                  component={RouterLink}
                  to="/admin"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Admin
                </Button>
                <Button
                  component={RouterLink}
                  to="/validator"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  startIcon={<QrCodeScannerIcon />}
                >
                  Validator
                </Button>
              </>
            )}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            {account ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={account} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                    </Typography>
                  </MenuItem>
                  {!isRegistered && (
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/register'); }}>
                      <Typography textAlign="center">Register</Typography>
                    </MenuItem>
                  )}
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
