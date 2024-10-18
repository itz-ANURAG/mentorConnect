import { Box, Grid, Card, CardContent, Typography, Button, Avatar, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import logo from '../assets/anurag.png';

const MentorSection = () => {
  return (
    <Box sx={{ p: 5, backgroundColor: '#f5f7f9', borderRadius: '10px' }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left Side - Mentor Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: '10px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                src={logo} // Replace with actual image URL
                alt="Mentor"
                sx={{ width: 80, height: 80, margin: 'auto', mb: 2 }}
              />
              <Typography variant="h6">Anurag Gupta</Typography>
              <Typography variant="body2" color="textSecondary">
                Senior Full Stack Developer
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Button fullWidth variant="outlined" sx={{ mb: 1 }}>
                Mentorship 
              </Button>
              <Button fullWidth variant="outlined" sx={{ mb: 1 }}>
                Intro Session
              </Button>
              <Button fullWidth variant="outlined" sx={{ mb: 1 }}>
                CV Review
              </Button>
              <Button fullWidth variant="outlined">
                Expert Session
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side - Text Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            At your fingertips: a dedicated career coach
          </Typography>
          <Typography variant="body1" paragraph>
            Want to start a new dream career? Successfully build your startup? Itching to learn high-demand skills? Work smart with an online mentor by your side to offer expert advice and guidance to match your zeal. Become unstoppable using MentorCruise.
          </Typography>

          <List>
            {[
              'Thousands of mentors available',
              'Free trial',
              '1-on-1 calls',
              'Flexible program structures',
              'Personal chats',
              '96% satisfaction rate',
            ].map((text, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon sx={{ color: 'green' }} />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>

          <Button variant="contained" color="success" sx={{ mt: 2 }}>
            GET STARTED
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MentorSection;