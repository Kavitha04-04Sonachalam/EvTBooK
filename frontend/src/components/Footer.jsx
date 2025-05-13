import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  Button,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.9 },
  };

  return (
    <Box
      component={motion.footer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={footerVariants}
      sx={{
        bgcolor: theme.palette.mode === 'dark' 
          ? 'rgba(19, 47, 76, 0.9)' 
          : 'rgba(232, 236, 241, 0.9)',
        py: 6,
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <ConfirmationNumberIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                </motion.div>
                <Typography
                  variant="h6"
                  component={RouterLink}
                  to="/"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.2rem',
                    color: 'primary.main',
                    textDecoration: 'none',
                  }}
                >
                  TICKETCHAIN
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                A decentralized event ticketing platform built on Ethereum blockchain.
                Secure, transparent, and user-friendly.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <motion.div variants={iconVariants} whileHover="hover" whileTap="tap">
                  <IconButton color="primary" aria-label="Twitter">
                    <TwitterIcon />
                  </IconButton>
                </motion.div>
                <motion.div variants={iconVariants} whileHover="hover" whileTap="tap">
                  <IconButton color="primary" aria-label="GitHub">
                    <GitHubIcon />
                  </IconButton>
                </motion.div>
                <motion.div variants={iconVariants} whileHover="hover" whileTap="tap">
                  <IconButton color="primary" aria-label="LinkedIn">
                    <LinkedInIcon />
                  </IconButton>
                </motion.div>
                <motion.div variants={iconVariants} whileHover="hover" whileTap="tap">
                  <IconButton color="primary" aria-label="Email">
                    <EmailIcon />
                  </IconButton>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <motion.div variants={itemVariants}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Quick Links
              </Typography>
              <Link component={RouterLink} to="/events" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Events
              </Link>
              <Link component={RouterLink} to="/my-tickets" color="text.secondary" display="block" sx={{ mb: 1 }}>
                My Tickets
              </Link>
              <Link component={RouterLink} to="/create-event" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Create Event
              </Link>
              <Link component={RouterLink} to="/validator" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Validate Tickets
              </Link>
            </motion.div>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={2}>
            <motion.div variants={itemVariants}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Resources
              </Typography>
              <Link component={RouterLink} to="/about" color="text.secondary" display="block" sx={{ mb: 1 }}>
                About Us
              </Link>
              <Link component={RouterLink} to="/faq" color="text.secondary" display="block" sx={{ mb: 1 }}>
                FAQ
              </Link>
              <Link component={RouterLink} to="/contact" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Contact
              </Link>
              <Link href="https://ethereum.org" target="_blank" rel="noopener" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Ethereum
              </Link>
            </motion.div>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Stay Updated
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Subscribe to our newsletter for the latest updates on events and features.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/contact"
                sx={{ mt: 1 }}
              >
                Contact Us
              </Button>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <motion.div variants={itemVariants}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} TicketChain. All rights reserved.
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link color="text.secondary" variant="body2" component={RouterLink} to="/about">
                Terms of Service
              </Link>
              <Link color="text.secondary" variant="body2" component={RouterLink} to="/about">
                Privacy Policy
              </Link>
            </Box>
          </motion.div>
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            style={{ display: 'inline-block' }}
          >
            <IconButton
              color="primary"
              onClick={scrollToTop}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'background.paper',
                },
              }}
            >
              <ArrowUpwardIcon />
            </IconButton>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
