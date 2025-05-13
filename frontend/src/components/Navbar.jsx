import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
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
  Badge,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ account, isRegistered, mode, toggleColorMode }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElInfo, setAnchorElInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set active tab based on current path
    const path = location.pathname;
    if (path.includes('/events')) {
      setActiveTab('events');
    } else if (path.includes('/create-event')) {
      setActiveTab('create-event');
    } else if (path.includes('/my-tickets')) {
      setActiveTab('my-tickets');
    } else if (path.includes('/admin')) {
      setActiveTab('admin');
    } else if (path.includes('/validator')) {
      setActiveTab('validator');
    } else if (path.includes('/profile')) {
      setActiveTab('profile');
    } else if (path.includes('/about')) {
      setActiveTab('about');
    } else if (path.includes('/faq')) {
      setActiveTab('faq');
    } else if (path.includes('/contact')) {
      setActiveTab('contact');
    } else {
      setActiveTab('');
    }
  }, [location]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenInfoMenu = (event) => {
    setAnchorElInfo(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseInfoMenu = () => {
    setAnchorElInfo(null);
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

  const isActive = (tab) => activeTab === tab;

  return (
    <AppBar
      position="static"
      component={motion.div}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for larger screens */}
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <ConfirmationNumberIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: 32 }} />
          </motion.div>
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
              background: 'linear-gradient(45deg, #ffffff 30%, #757de8 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
              sx={{
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
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
                  </MenuItem>,
                  <MenuItem key="profile" onClick={() => { handleCloseNavMenu(); navigate('/profile'); }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>,
                  <Divider key="divider" />,
                  <MenuItem key="about" onClick={() => { handleCloseNavMenu(); navigate('/about'); }}>
                    <Typography textAlign="center">About</Typography>
                  </MenuItem>,
                  <MenuItem key="faq" onClick={() => { handleCloseNavMenu(); navigate('/faq'); }}>
                    <Typography textAlign="center">FAQ</Typography>
                  </MenuItem>,
                  <MenuItem key="contact" onClick={() => { handleCloseNavMenu(); navigate('/contact'); }}>
                    <Typography textAlign="center">Contact</Typography>
                  </MenuItem>
                ]
              )}
              {!isRegistered && account && (
                [
                  <MenuItem key="register" onClick={() => { handleCloseNavMenu(); navigate('/register'); }}>
                    <Typography textAlign="center">Register</Typography>
                  </MenuItem>,
                  <Divider key="divider" />,
                  <MenuItem key="about" onClick={() => { handleCloseNavMenu(); navigate('/about'); }}>
                    <Typography textAlign="center">About</Typography>
                  </MenuItem>,
                  <MenuItem key="faq" onClick={() => { handleCloseNavMenu(); navigate('/faq'); }}>
                    <Typography textAlign="center">FAQ</Typography>
                  </MenuItem>,
                  <MenuItem key="contact" onClick={() => { handleCloseNavMenu(); navigate('/contact'); }}>
                    <Typography textAlign="center">Contact</Typography>
                  </MenuItem>
                ]
              )}
              {!account && (
                [
                  <MenuItem key="about" onClick={() => { handleCloseNavMenu(); navigate('/about'); }}>
                    <Typography textAlign="center">About</Typography>
                  </MenuItem>,
                  <MenuItem key="faq" onClick={() => { handleCloseNavMenu(); navigate('/faq'); }}>
                    <Typography textAlign="center">FAQ</Typography>
                  </MenuItem>,
                  <MenuItem key="contact" onClick={() => { handleCloseNavMenu(); navigate('/contact'); }}>
                    <Typography textAlign="center">Contact</Typography>
                  </MenuItem>
                ]
              )}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex' }}
          >
            <ConfirmationNumberIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          </motion.div>
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
              background: 'linear-gradient(45deg, #ffffff 30%, #757de8 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            TICKETCHAIN
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {isRegistered && (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={RouterLink}
                    to="/events"
                    sx={{
                      my: 2,
                      mx: 0.5,
                      color: 'white',
                      display: 'block',
                      position: 'relative',
                      '&::after': isActive('events') ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '25%',
                        width: '50%',
                        height: '3px',
                        bgcolor: 'secondary.main',
                        borderRadius: '3px',
                      } : {}
                    }}
                  >
                    Events
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={RouterLink}
                    to="/create-event"
                    sx={{
                      my: 2,
                      mx: 0.5,
                      color: 'white',
                      display: 'block',
                      position: 'relative',
                      '&::after': isActive('create-event') ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '25%',
                        width: '50%',
                        height: '3px',
                        bgcolor: 'secondary.main',
                        borderRadius: '3px',
                      } : {}
                    }}
                  >
                    Create Event
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={RouterLink}
                    to="/my-tickets"
                    sx={{
                      my: 2,
                      mx: 0.5,
                      color: 'white',
                      display: 'block',
                      position: 'relative',
                      '&::after': isActive('my-tickets') ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '25%',
                        width: '50%',
                        height: '3px',
                        bgcolor: 'secondary.main',
                        borderRadius: '3px',
                      } : {}
                    }}
                  >
                    My Tickets
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={RouterLink}
                    to="/admin"
                    sx={{
                      my: 2,
                      mx: 0.5,
                      color: 'white',
                      display: 'block',
                      position: 'relative',
                      '&::after': isActive('admin') ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '25%',
                        width: '50%',
                        height: '3px',
                        bgcolor: 'secondary.main',
                        borderRadius: '3px',
                      } : {}
                    }}
                  >
                    Admin
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={RouterLink}
                    to="/validator"
                    sx={{
                      my: 2,
                      mx: 0.5,
                      color: 'white',
                      display: 'block',
                      position: 'relative',
                      '&::after': isActive('validator') ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '25%',
                        width: '50%',
                        height: '3px',
                        bgcolor: 'secondary.main',
                        borderRadius: '3px',
                      } : {}
                    }}
                    startIcon={<QrCodeScannerIcon />}
                  >
                    Validator
                  </Button>
                </motion.div>
              </>
            )}

            {/* Info menu button for desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
              <Tooltip title="Information">
                <IconButton
                  onClick={handleOpenInfoMenu}
                  sx={{ color: 'white' }}
                  aria-controls="info-menu"
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="info-menu"
                anchorEl={anchorElInfo}
                open={Boolean(anchorElInfo)}
                onClose={handleCloseInfoMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { handleCloseInfoMenu(); navigate('/about'); }}>
                  <InfoIcon sx={{ mr: 1 }} />
                  <Typography>About</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleCloseInfoMenu(); navigate('/faq'); }}>
                  <HelpIcon sx={{ mr: 1 }} />
                  <Typography>FAQ</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleCloseInfoMenu(); navigate('/contact'); }}>
                  <ContactSupportIcon sx={{ mr: 1 }} />
                  <Typography>Contact</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Theme toggle */}
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'secondary.main',
                  }
                }}
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </motion.div>
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {account ? (
              <>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{
                        p: 0,
                        border: isActive('profile') ? '2px solid' : 'none',
                        borderColor: 'secondary.main',
                      }}
                    >
                      <Avatar
                        alt={account}
                        src="/static/images/avatar/2.jpg"
                        sx={{
                          bgcolor: 'primary.dark',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.3)',
                          }
                        }}
                      >
                        <AccountCircleIcon />
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </motion.div>
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
                  <MenuItem onClick={handleCloseUserMenu} disabled>
                    <Typography textAlign="center" fontWeight="bold">
                      {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  {isRegistered && (
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                      <AccountCircleIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                  )}
                  {!isRegistered && (
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/register'); }}>
                      <Typography textAlign="center">Register</Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => { handleCloseUserMenu(); /* Implement logout */ }}>
                    <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography textAlign="center">Disconnect</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={connectWallet}
                  sx={{
                    borderRadius: 4,
                    px: 2,
                    py: 1,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  Connect Wallet
                </Button>
              </motion.div>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
