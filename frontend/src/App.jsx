import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import MyTickets from './pages/MyTickets';
import Admin from './pages/Admin';
import Validator from './pages/Validator';
import Profile from './pages/Profile';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import { isUserRegistered } from './utils/contracts';

// Theme configuration
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: {
            main: '#3f51b5', // Indigo
            light: '#757de8',
            dark: '#002984',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#f50057', // Pink
            light: '#ff5983',
            dark: '#bb002f',
            contrastText: '#ffffff',
          },
          success: {
            main: '#4caf50',
            light: '#80e27e',
            dark: '#087f23',
          },
          error: {
            main: '#f44336',
            light: '#ff7961',
            dark: '#ba000d',
          },
          background: {
            default: '#f5f5f5', // Light gray
            paper: '#ffffff', // White
          },
          divider: 'rgba(0, 0, 0, 0.12)',
          text: {
            primary: '#212121',
            secondary: '#757575',
          },
        }
      : {
          // Dark mode palette
          primary: {
            main: '#3f51b5', // Indigo
            light: '#757de8',
            dark: '#002984',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#f50057', // Pink
            light: '#ff5983',
            dark: '#bb002f',
            contrastText: '#ffffff',
          },
          success: {
            main: '#4caf50',
            light: '#80e27e',
            dark: '#087f23',
          },
          error: {
            main: '#f44336',
            light: '#ff7961',
            dark: '#ba000d',
          },
          background: {
            default: '#0a1929', // Deep blue-black
            paper: '#132f4c', // Slightly lighter blue
          },
          divider: 'rgba(255, 255, 255, 0.12)',
        }),
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '0.0075em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #3f51b5 0%, #002984 100%)',
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(45deg, #f50057 30%, #ff5983 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        },
        elevation2: {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
        },
        elevation3: {
          boxShadow: '0 12px 25px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#0a1929',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#3f51b5',
            borderRadius: '4px',
          },
        },
      },
    },
  },
});

function App() {
  const [account, setAccount] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('dark'); // Default to dark mode

  // Toggle theme function
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Create theme based on current mode
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.send('eth_accounts', []);

          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const registered = await isUserRegistered(accounts[0]);
            setIsRegistered(registered);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking connection:', error);
        setLoading(false);
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const registered = await isUserRegistered(accounts[0]);
          setIsRegistered(registered);
        } else {
          setAccount('');
          setIsRegistered(false);
        }
      });
    }
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children, requiresRegistration = true }) => {
    if (loading) return <div>Loading...</div>;

    if (!account) {
      return <Navigate to="/" replace />;
    }

    if (requiresRegistration && !isRegistered) {
      return <Navigate to="/register" replace />;
    }

    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: theme.palette.mode === 'dark'
            ? 'background.default'
            : 'background.default',
          backgroundImage: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #000114 100%)'
            : 'radial-gradient(circle at 50% 14em, #f5f7fa 0%, #e4e8f0 60%, #d5dbe6 100%)',
          backgroundAttachment: 'fixed'
        }}>
          <Navbar
            account={account}
            isRegistered={isRegistered}
            mode={mode}
            toggleColorMode={toggleColorMode}
          />
          <Box sx={{ flex: '1 0 auto', py: 2 }}>
            <AnimatePresence mode="wait">
              <Routes>
            <Route path="/" element={<Home account={account} />} />
            <Route
              path="/register"
              element={
                account ? (
                  isRegistered ? (
                    <Navigate to="/events" replace />
                  ) : (
                    <Register account={account} setIsRegistered={setIsRegistered} />
                  )
                ) : (
                  <Home account={account} />
                )
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events account={account} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetails account={account} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <CreateEvent account={account} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute>
                  <MyTickets account={account} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin account={account} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/validator"
              element={
                <ProtectedRoute>
                  <Validator account={account} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile account={account} />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
            </AnimatePresence>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
