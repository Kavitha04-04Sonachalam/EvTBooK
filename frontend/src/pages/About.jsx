import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GroupsIcon from '@mui/icons-material/Groups';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';

const About = () => {
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
              About TicketChain
            </Typography>
            <Typography variant="body1" color="text.secondary">
              A decentralized event ticketing platform built on blockchain technology
            </Typography>
          </Box>
          <Divider sx={{ mb: 4 }} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              TicketChain aims to revolutionize the event ticketing industry by leveraging blockchain technology to create a secure, transparent, and fair ticketing ecosystem. We're eliminating scalping, counterfeit tickets, and unfair pricing practices while giving event organizers more control over their ticket distribution.
            </Typography>
            <Typography variant="body1">
              By using NFTs (Non-Fungible Tokens) for tickets, we ensure each ticket is unique, verifiable, and can have programmable transfer rules. This means event creators can set limits on resale prices, receive royalties from secondary sales, and ensure tickets only go to verified users.
            </Typography>
          </Paper>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h4" gutterBottom>
            Key Features
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                      <SecurityIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h5" component="div" align="center" gutterBottom>
                    Anti-Scalping
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Smart contracts enforce rules to prevent ticket scalping and unauthorized resales. Event organizers can set maximum resale prices and receive royalties from secondary market sales.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                      <VerifiedUserIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h5" component="div" align="center" gutterBottom>
                    Verified Users
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All users are verified by platform administrators, ensuring legitimacy and reducing fraud. This creates a trusted ecosystem for both event organizers and attendees.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                      <AccountBalanceWalletIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h5" component="div" align="center" gutterBottom>
                    Blockchain Powered
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Built on Ethereum, our platform provides transparency, security, and immutability. Every transaction is recorded on the blockchain, creating an auditable history of ticket ownership.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h4" gutterBottom>
            Technology Stack
          </Typography>
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <CodeIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Smart Contracts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Solidity, ERC-721 NFT Standard, OpenZeppelin
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <StorageIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Storage
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    IPFS via Pinata for decentralized storage of ticket metadata and images
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <GroupsIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Frontend
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    React, Material UI, ethers.js, Web3 integration
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h4" gutterBottom>
            Our Team
          </Typography>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="body1" paragraph>
              TicketChain was developed by a team of blockchain enthusiasts and developers passionate about creating fair and transparent systems. Our diverse team brings together expertise in blockchain development, web design, and event management.
            </Typography>
            <Typography variant="body1">
              We believe in the power of decentralized technology to solve real-world problems and are committed to building tools that make blockchain accessible and useful for everyone.
            </Typography>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default About;
