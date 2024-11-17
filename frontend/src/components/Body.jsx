import { Box, Typography, Button, Card, CardContent, Avatar } from '@mui/material';
import StatisticsSection from './StatsHomePage';
import bodyImage from '../assets/mentor.png';

const mentors = [
  { 
    name: "Alice Cooper", 
    bio: "Frontend Developer", 
    expertise: "Vue.js", 
    profilePicture: "https://randomuser.me/api/portraits/women/1.jpg" 
  },
  { 
    name: "David Green", 
    bio: "Mobile Developer", 
    expertise: "Flutter", 
    profilePicture: "https://randomuser.me/api/portraits/men/2.jpg" 
  },
  { 
    name: "Emily Carter", 
    bio: "UI/UX Designer", 
    expertise: "Figma", 
    profilePicture: "https://randomuser.me/api/portraits/women/3.jpg" 
  },
  { 
    name: "Michael Brown", 
    bio: "Backend Engineer", 
    expertise: "Python", 
    profilePicture: "https://randomuser.me/api/portraits/men/4.jpg" 
  },
  { 
    name: "Sophia Harris", 
    bio: "Full Stack Developer", 
    expertise: "JavaScript", 
    profilePicture: "https://randomuser.me/api/portraits/women/5.jpg" 
  },
  { 
    name: "James Taylor", 
    bio: "Data Scientist", 
    expertise: "Machine Learning", 
    profilePicture: "https://randomuser.me/api/portraits/men/6.jpg" 
  }
];

const Body = () => {
  return (
    <>
      <Box sx={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Side - Title and Search */}
        <Box sx={{ flex: 1.5 }}>
          <Box>
            <img 
              src={bodyImage} 
              alt="Logo" 
              style={{ height: '300px', width: 'auto', marginLeft: '10rem' }} 
            />
          </Box>

          <Typography marginLeft={4} marginTop={5}>
            <Typography variant="h2" mb={3}>
              Connect with the world's top <span style={{ color: '#d40954' }}>| Mentors</span>
            </Typography>
            <Typography variant="h5" mb={3}>
              Discover the best mentors for your career.
              <br />
              Learn a new skill, launch a project, land your dream career.
            </Typography>
          </Typography>

          <Button 
            variant="contained" 
            color="success" 
            sx={{ mt: 2, ml: 4 }} 
            size="large"
          >
            Get Started
          </Button>

          {/* Tags below the search */}
          <Box sx={{ ml: 4, mt: 3, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              'Product Managers', 
              'Application Developers', 
              'Backend Engineers', 
              'Frontend Engineers', 
              'Data Scientists', 
              'UX Designers', 
              'Leadership Mentors'
            ].map((tag) => (
              <Button key={tag} variant="outlined">
                {tag}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Right Side - Scrollable Mentor Cards */}
        <Box 
          sx={{ 
            width: '40%', 
            marginTop: '8vh', 
            height: '60vh', 
            overflowY: 'scroll', 
            padding: '5px', 
            backgroundColor: '#ffffff', 
            borderRadius: '6px', 
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#FFFFFF', borderRadius: '2px' },
            '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {mentors.map((mentor, index) => (
              <Card 
                key={index} 
                sx={{ 
                  width: '100%', 
                  padding: '10px', 
                  backgroundColor: '#ffffff', 
                  boxShadow: 1, 
                  borderRadius: '6px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                }}
              >
                {/* Avatar on the left */}
                <Avatar 
                  src={mentor.profilePicture} 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    marginLeft: '10px',
                  }} 
                />
                {/* Text info on the right */}
                <CardContent sx={{ padding: '5', flex: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 700, 
                      color: '#333', 
                      marginBottom: '5px',
                    }}
                  >
                    {mentor.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '1rem', 
                      color: '#555', 
                      marginBottom: '3px',
                    }}
                  >
                    {mentor.bio}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.95rem', 
                      color: '#4caf50', 
                      fontWeight: 600,
                    }}
                  >
                    {mentor.expertise}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ margin: '1rem' }}>
        <StatisticsSection />
      </Box>
    </>
  );
};

export default Body;
