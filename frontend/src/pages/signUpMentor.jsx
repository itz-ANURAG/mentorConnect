

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Avatar, IconButton, Container, Chip, MenuItem, Select } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ensure this path is correct

// Custom Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0D47A1', // Dark blue
    },
    secondary: {
      main: '#ffffff', // White
    },
  },
  typography: {
    allVariants: {
      color: '#ffffff',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#0D47A1', // Dark blue label
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#0D47A1', // Dark blue border
            },
            '&:hover fieldset': {
              borderColor: '#0D47A1', // Border on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0D47A1', // Border on focus
            },
          },
        },
      },
    },
  },
});

const validSkills = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'CSS', 'HTML']; // Add valid skills here

const MentorSignup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [mentorData, setMentorData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
    bio: '',
    jobTitle: '',
    company: '',
    location: '',
    summary: '',
    skills: [],
    skillInput: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentorData({ ...mentorData, [name]: value });
  };

  const handleAddSkill = () => {
    if (mentorData.skillInput.trim() !== '') {
      setMentorData({
        ...mentorData,
        skills: [...mentorData.skills, mentorData.skillInput.trim()],
        skillInput: '',
      });
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setMentorData({
      ...mentorData,
      skills: mentorData.skills.filter((skill) => skill !== skillToDelete),
    });
  };

  const handleNext = () => {
    if (activeStep === 0 && mentorData.password !== mentorData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(mentorData); // Send the data to the backend
    alert('Form Submitted Successfully!');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters>
        <Box sx={{ display: 'flex', height: '100vh' }}>
          {/* Left side - Black Background */}
          <Box
            sx={{
              width: '50%',
              bgcolor: 'black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main' }}>
              <img
                src={logo}
                alt="logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Avatar>
          </Box>

          {/* Right side - Form */}
          <Box
            sx={{
              width: '50%',
              p: 5,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between', // Ensures even spacing between elements
              bgcolor: 'secondary.main',
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                width: '100%',
                maxWidth: '500px',
              }}
            >
              {activeStep === 0 ? (
                <>
                  {/* Heading for Sign Up */}
                  <Typography
                    variant="h4"
                    sx={{ color: 'black', textAlign: 'center', mb: 3 }} // Black color heading
                  >
                    Sign Up Mentor
                  </Typography>

                  {/* Step 1: Primary Info */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton color="primary" component="label">
                        <input
                          type="file"
                          hidden
                          onChange={(e) => setMentorData({ ...mentorData, profilePicture: e.target.files[0] })}
                        />
                        <Avatar sx={{ width: 100, height: 100 }}>
                          <AddAPhotoIcon />
                        </Avatar>
                      </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Full Name"
                        name="name"
                        value={mentorData.name}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Email"
                        name="email"
                        value={mentorData.email}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        type="password"
                        label="Password"
                        name="password"
                        value={mentorData.password}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        type="password"
                        label="Confirm Password"
                        name="confirmPassword"
                        value={mentorData.confirmPassword}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    {/* Bottom buttons row */}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                        Already registered?{' '}
                        <Link to="/mentor-login" style={{ color: '#0D47A1', textDecoration: 'underline' }}>
                          Login here
                        </Link>
                      </Typography>
                      <Button variant="contained" color="primary" onClick={handleNext}>
                        Next
                      </Button>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  {/* Step 2: Secondary Info */}
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        value={mentorData.bio}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        name="jobTitle"
                        value={mentorData.jobTitle}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company"
                        name="company"
                        value={mentorData.company}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={mentorData.location}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Summary (Optional)"
                        name="summary"
                        value={mentorData.summary}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">Skills</Typography>
                      <Select
                        fullWidth
                        value={mentorData.skillInput}
                        onChange={(e) => setMentorData({ ...mentorData, skillInput: e.target.value })}
                        displayEmpty
                        variant="outlined"
                        sx={{ backgroundColor: '#0D47A1', color: 'white' }}  // Darker dropdown background and white text
                      >
                        <MenuItem value="" disabled>
                          Select a Skill
                        </MenuItem>
                        {validSkills.map((skill, index) => (
                          <MenuItem key={index} value={skill}>
                            {skill}
                          </MenuItem>
                        ))}
                      </Select>
                      <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddSkill}>
                        Add Skill
                      </Button>
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
                        {mentorData.skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            onDelete={() => handleDeleteSkill(skill)}
                            deleteIcon={<DeleteIcon />}
                            sx={{ marginRight: 1, marginBottom: 1 }}
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="contained" color="primary" onClick={handlePrev}>
                        Previous
                      </Button>
                      <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default MentorSignup;
