import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SecurityIcon from '@mui/icons-material/Security';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
  const [expanded, setExpanded] = useState(false);
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const faqItems = [
    {
      id: 'panel1',
      category: 'general',
      question: 'What is TicketChain?',
      answer: 'TicketChain is a decentralized event ticketing platform built on blockchain technology. It uses NFTs (Non-Fungible Tokens) to create unique, verifiable tickets that cannot be counterfeited and have programmable transfer rules to prevent scalping.'
    },
    {
      id: 'panel2',
      category: 'wallet',
      question: 'What wallet do I need to use TicketChain?',
      answer: 'TicketChain works with MetaMask, which is a browser extension and mobile app that serves as an Ethereum wallet. You\'ll need to install MetaMask and have some ETH (on the Sepolia testnet for now) to pay for transaction fees.'
    },
    {
      id: 'panel3',
      category: 'tickets',
      question: 'How do I purchase a ticket?',
      answer: 'To purchase a ticket, you need to connect your wallet, browse the available events, select the event you want to attend, and click the "Buy Ticket" button. You\'ll need to confirm the transaction in your wallet and pay the ticket price plus a small gas fee.'
    },
    {
      id: 'panel4',
      category: 'tickets',
      question: 'Where are my tickets stored?',
      answer: 'Your tickets are stored as NFTs (Non-Fungible Tokens) on the Ethereum blockchain. You can view your tickets in the "My Tickets" section of TicketChain or in any NFT marketplace that supports the ERC-721 standard.'
    },
    {
      id: 'panel5',
      category: 'events',
      question: 'How do I create an event?',
      answer: 'To create an event, you need to be a verified user. Once verified, you can go to the "Create Event" page, fill in the event details (name, date, location, ticket price, etc.), upload an image, and submit. Your event will be created on the blockchain and tickets will be available for purchase.'
    },
    {
      id: 'panel6',
      category: 'security',
      question: 'How does TicketChain prevent ticket scalping?',
      answer: 'TicketChain uses smart contracts to enforce rules on ticket transfers. Event organizers can set maximum resale prices, receive royalties from secondary sales, or even disable transfers completely. All transfers happen on the blockchain, ensuring transparency and compliance with the rules.'
    },
    {
      id: 'panel7',
      category: 'security',
      question: 'How are tickets validated at events?',
      answer: 'Tickets include a QR code that can be scanned by event staff using the TicketChain Validator app. The validator checks the blockchain to confirm the ticket is valid, has not been used, and belongs to the person presenting it.'
    },
    {
      id: 'panel8',
      category: 'general',
      question: 'Is TicketChain available worldwide?',
      answer: 'Yes, TicketChain is a decentralized application that runs on the Ethereum blockchain, which is accessible worldwide. Anyone with an internet connection and an Ethereum wallet can use TicketChain to buy tickets or create events.'
    },
    {
      id: 'panel9',
      category: 'wallet',
      question: 'What happens if I lose access to my wallet?',
      answer: 'If you lose access to your wallet, you lose access to your tickets. It\'s important to keep your wallet seed phrase (recovery phrase) in a safe place. TicketChain cannot recover your tickets if you lose access to your wallet.'
    },
    {
      id: 'panel10',
      category: 'events',
      question: 'Can I refund a ticket?',
      answer: 'Refund policies are set by event organizers. Some events may allow refunds up to a certain date, while others may not allow refunds at all. Check the event details for the refund policy before purchasing a ticket.'
    }
  ];

  const filteredFaqs = category === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === category);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Find answers to common questions about TicketChain
            </Typography>
          </Box>
          <Divider sx={{ mb: 4 }} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item>
              <Button 
                variant={category === 'all' ? 'contained' : 'outlined'} 
                onClick={() => handleCategoryChange('all')}
                startIcon={<HelpOutlineIcon />}
              >
                All
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant={category === 'general' ? 'contained' : 'outlined'} 
                onClick={() => handleCategoryChange('general')}
              >
                General
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant={category === 'wallet' ? 'contained' : 'outlined'} 
                onClick={() => handleCategoryChange('wallet')}
                startIcon={<AccountBalanceWalletIcon />}
              >
                Wallet
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant={category === 'tickets' ? 'contained' : 'outlined'} 
                onClick={() => handleCategoryChange('tickets')}
                startIcon={<ConfirmationNumberIcon />}
              >
                Tickets
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant={category === 'events' ? 'contained' : 'outlined'} 
                onClick={() => handleCategoryChange('events')}
                startIcon={<EventIcon />}
              >
                Events
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant={category === 'security' ? 'contained' : 'outlined'} 
                onClick={() => handleCategoryChange('security')}
                startIcon={<SecurityIcon />}
              >
                Security
              </Button>
            </Grid>
          </Grid>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <AnimatePresence>
              {filteredFaqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Accordion
                    expanded={expanded === faq.id}
                    onChange={handleChange(faq.id)}
                    sx={{
                      '&:before': {
                        display: 'none',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${faq.id}-content`}
                      id={`${faq.id}-header`}
                      sx={{
                        backgroundColor: expanded === faq.id ? 'rgba(63, 81, 181, 0.08)' : 'transparent',
                        transition: 'background-color 0.3s',
                      }}
                    >
                      <Typography variant="h6">{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1">{faq.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))}
            </AnimatePresence>
          </Paper>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ mt: 6, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Still have questions?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Contact Support
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Our support team is available to help with any questions or issues you may have.
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/contact')}>
                      Contact Us
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Learn More
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Check out our documentation and guides to learn more about TicketChain.
                    </Typography>
                    <Button variant="outlined" onClick={() => navigate('/about')}>
                      About TicketChain
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default FAQ;
