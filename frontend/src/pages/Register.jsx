import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  Grow,
  Zoom,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { registerUser } from '../utils/contracts';

const Register = ({ account, setIsRegistered }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Validate name when it changes
    if (name.trim() === '') {
      setNameValid(false);
      if (formTouched) setNameError('Name is required');
    } else if (name.length < 3) {
      setNameValid(false);
      if (formTouched) setNameError('Name must be at least 3 characters');
    } else {
      setNameValid(true);
      setNameError('');
    }
  }, [name, formTouched]);

  useEffect(() => {
    // Validate email when it changes
    if (email.trim() === '') {
      setEmailValid(false);
      if (formTouched) setEmailError('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailValid(false);
        if (formTouched) setEmailError('Please enter a valid email address');
      } else {
        setEmailValid(true);
        setEmailError('');
      }
    }
  }, [email, formTouched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched(true);

    // Validate form before submission
    if (!nameValid || !emailValid) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerUser(name, email);
      setSuccess(true);
      setIsRegistered(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/events');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldFocus = () => {
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 8,
            mb: 4,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Background decoration */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '150px',
              height: '150px',
              borderRadius: '0 0 0 100%',
              background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.1) 0%, rgba(63, 81, 181, 0.3) 100%)',
              zIndex: 0,
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography component="h1" variant="h4" align="center" gutterBottom>
                User Registration
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Typography variant="body1" align="center" color="text.secondary" paragraph>
                Register to access events and purchase tickets. Your account will need to be verified by an admin.
              </Typography>
            </motion.div>

            {error && (
              <Grow in={!!error}>
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
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
              </Grow>
            )}

            {success ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    '& .MuiAlert-icon': {
                      fontSize: '2rem',
                      mr: 2,
                    }
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Registration successful!
                    </Typography>
                    <Typography variant="body2">
                      You will be redirected to the events page. Please wait for admin verification to create events.
                    </Typography>
                  </Box>
                </Alert>
              </motion.div>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={handleFieldFocus}
                    disabled={loading}
                    error={!!nameError}
                    helperText={nameError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color={nameError ? 'error' : nameValid ? 'success' : 'action'} />
                        </InputAdornment>
                      ),
                      endAdornment: name && (
                        <InputAdornment position="end">
                          {nameValid ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            formTouched && name && <ErrorIcon color="error" />
                          )}
                        </InputAdornment>
                      ),
                      sx: {
                        transition: 'all 0.3s ease',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)',
                        },
                      }
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleFieldFocus}
                    disabled={loading}
                    error={!!emailError}
                    helperText={emailError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color={emailError ? 'error' : emailValid ? 'success' : 'action'} />
                        </InputAdornment>
                      ),
                      endAdornment: email && (
                        <InputAdornment position="end">
                          {emailValid ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            formTouched && email && <ErrorIcon color="error" />
                          )}
                        </InputAdornment>
                      ),
                      sx: {
                        transition: 'all 0.3s ease',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)',
                        },
                      }
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Box sx={{ mt: 3, mb: 2 }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading || !nameValid || !emailValid}
                      sx={{
                        py: 1.5,
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
                      {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Connected Wallet: <span style={{ fontWeight: 'bold' }}>{account}</span>
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Register;
