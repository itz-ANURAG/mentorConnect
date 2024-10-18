import { Box, Typography, Button } from '@mui/material';
import StatisticsSection from './StatsHomePage';
import bodyImage from '../assets/mentor.png';
import ScrollableMentorSection from './AutoScrollhomepage';

const mentors = [
  { name: "John Doe", bio: "Senior Developer", expertise: "React" },
  { name: "Jane Smith", bio: "Backend Developer", expertise: "Node.js" },
  { name: "John Doe", bio: "Senior Developer", expertise: "React" },
  { name: "Jane Smith", bio: "Backend Developer", expertise: "Node.js" },
  { name: "John Doe", bio: "Senior Developer", expertise: "React" },
  { name: "Jane Smith", bio: "Backend Developer", expertise: "Node.js" },
  // Add more mentor objects as needed
];

const Body = () => {
  return (
    <>
      <Box sx={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Side - Title and Search */}
        <Box sx={{ flex: 1.5 }}>
          <Box>
            <img src={bodyImage} alt="Logo" style={{ height: '300px', width: 'auto', marginLeft: '10rem' }} />
          </Box>

          <Typography marginLeft={4} marginTop={5}>
            <Typography variant="h2" mb={3}>
              Connect with the worlds top <span style={{ color: '#d40954' }}>| Mentors</span>
            </Typography>
            <Typography variant="h5" mb={3}>
              Discover the best mentors for your career.
              <br />
              Learn a new skill, launch a project, land your dream career.
            </Typography>
          </Typography>

          <Button variant="contained" color="success" sx={{ mt: 2, ml: 4 }} size="large">
            Get Started
          </Button>

          {/* Tags below the search */}
          <Box sx={{ ml: 4, mt: 3, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['Product Managers', 'Application Developers', 'Backend Engineers', 'Frontend Engineers', 'Data Scientists', 'UX Designers', 'Leadership Mentors'].map((tag) => (
              <Button key={tag} variant="outlined">
                {tag}
              </Button>
            ))}
          </Box>

        </Box>

        {/* Right Side - Scrollable Mentor Cards */}
        <Box sx={{ width: '40%',marginTop : '10vh' ,height: '60vh', overflowX: 'scroll',padding: '10px' }}>
          <ScrollableMentorSection mentors={mentors} speed={3}/>
        </Box>
      </Box>
      <Box sx={{margin : '1rem'}}>
      <StatisticsSection />
      </Box>
      
    </>
  );
};

export default Body;