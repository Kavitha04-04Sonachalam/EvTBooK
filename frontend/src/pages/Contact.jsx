import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import SendIcon from '@mui/icons-material/Send';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // In a real app, you would send the form data to a backend service
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
            <Typography component="h1" variant="h3" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get in touch with the TicketChain team
            </Typography>
          </Box>
          <Divider sx={{ mb: 4 }} />
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <motion.div variants={itemVariants}>
              <Typography variant="h5" gutterBottom>
                Get In Touch
              </Typography>
              <Typography variant="body1" paragraph>
                Have questions about TicketChain? Want to report an issue or suggest a feature? We'd love to hear from you! Fill out the form and we'll get back to you as soon as possible.
              </Typography>

              <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6">Email Us</Typography>
                      <Typography variant="body2" color="text.secondary">
                        support@ticketchain.example.com
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TwitterIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6">Follow Us</Typography>
                      <Typography variant="body2" color="text.secondary">
                        @TicketChain
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <GitHubIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6">GitHub</Typography>
                      <Typography variant="body2" color="text.secondary">
                        github.com/ticketchain
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={7}>
            <motion.div variants={itemVariants}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Send Us a Message
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Your message has been sent successfully! We'll get back to you soon.
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                          '& label.Mui-focused': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                          '& label.Mui-focused': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={loading}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                          '& label.Mui-focused': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Message"
                        multiline
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={loading}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                          '& label.Mui-focused': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        endIcon={<SendIcon />}
                        sx={{
                          mt: 2,
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          boxShadow: 3,
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.02)',
                          },
                        }}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Contact;
