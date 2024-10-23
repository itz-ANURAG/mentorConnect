import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Grid, Avatar, IconButton, Container, Chip, MenuItem, Select } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link,useNavigate  } from 'react-router-dom';
import {useSelector,useDispatch} from "react-redux";
import {setToken,setLoading} from "../slices/authSlice"
import {toast} from "react-hot-toast"
import logo from '../assets/logo.png'; // Ensure this path is correct

// Custom Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green
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
            color: '#2E7D32', // Green label
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#2E7D32', // Green border
            },
            '&:hover fieldset': {
              borderColor: '#2E7D32', // Border on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2E7D32', // Border on focus
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
    profilePicture: null,
    bio: '',
    jobTitle: '',
    company: '',
    location: '',
    summary: '',
    skills: [],
    skillInput: '',
  });
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const loading =useSelector((state)=>(state.auth.loading))
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentorData({ ...mentorData, [name]: value });
  };

  const handleAddSkill = () => {
    if (mentorData.skillInput.trim() !== '' && !mentorData.skills.includes(mentorData.skillInput.trim())) {
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
      setError('Passwords do not match');
      return;
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true))
    setError('');

    try {
      const formDataToSend = new FormData();
      for (const key in mentorData) {
        formDataToSend.append(key, mentorData[key]);
      }
      console.log(formDataToSend);
      const response = await axios.post('/api/signUpMentor', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(setToken(response.data.token));
      toast.success("Signed in successfuly")
      navigate("/profile")
      
    } catch (err) {
      // Handle errors
      toast.error("something went wrong ,Plz try again")
    } finally {
      dispatch(setLoading(false))
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters>
        <Box sx={{ display: 'flex', height: '100vh' }}>
          {/* Left side - Black Background with Padding */}
          <Box
            sx={{
              width: '50%',
              bgcolor: 'black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '30px', // Added padding for space between border and logo
            }}
          >
            <Avatar sx={{ width: 150, height: 150, bgcolor: 'black' }}>
              <img
                src={logo}
                alt="logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} // Ensure the logo fits inside the avatar
              />
            </Avatar>
          </Box>

          {/* Right side - Form (Centered) */}
          <Box
            sx={{
              width: '50%',
              p: 6, // Increased padding to center form better
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              bgcolor: 'secondary.main',
              alignItems: 'center', // Center form horizontally
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
                    sx={{ color: 'black', textAlign: 'center', mb: 3 }}
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
                          accept="image/*"
                          onChange={(e) => setMentorData({ ...mentorData, profilePicture: e.target.files[0] })}
                        />
                        <Avatar sx={{ width: 100, height: 100 }}>
                          {mentorData.profilePicture ? (
                            <img
                              src={URL.createObjectURL(mentorData.profilePicture)}
                              alt="Profile"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <AddAPhotoIcon />
                          )}
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
                        type="email"
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
                    {error && (
                      <Grid item xs={12}>
                        <Typography color="error" variant="body2">
                          {error}
                        </Typography>
                      </Grid>
                    )}
                    {/* Bottom buttons row */}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                        Already registered?{' '}
                        <Link
                          to="/login"
                          style={{
                            color: '#2E7D32',
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                            transition: 'color 0.3s',
                          }}
                          onMouseEnter={(e) => (e.target.style.color = '#1B5E20')}
                          onMouseLeave={(e) => (e.target.style.color = '#2E7D32')}
                        >
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
                  {/* Heading for Step 2 */}
                  <Typography
                    variant="h4"
                    sx={{ color: 'black', textAlign: 'center', mb: 3 }}
                  >
                    Additional Information
                  </Typography>

                  {/* Step 2: Secondary Info */}
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio(Optional)"
                        name="bio"
                        value={mentorData.bio}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
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
                        required
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
                        required
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
                        required
                        label="Summary"
                        name="summary"
                        value={mentorData.summary}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={3}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">Skills</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Select
                          fullWidth
                          value={mentorData.skillInput}
                          onChange={(e) => setMentorData({ ...mentorData, skillInput: e.target.value })}
                          displayEmpty
                          variant="outlined"
                          sx={{
                            backgroundColor: '#1B5E20', // Darker green for the Select
                            color: 'white', // White text for the Select
                            '& .MuiSelect-select': {
                              padding: '10px', // Add padding for better appearance
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#2E7D32', // Green border color
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#2E7D32', // Border color on hover
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#2E7D32', // Border color on focus
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>Select a Skill</em>
                          </MenuItem>
                          {validSkills.map((skill, index) => (
                            <MenuItem
                              key={index}
                              value={skill}
                              sx={{
                                backgroundColor: '#1B5E20', // Dark background for dropdown items
                                color: 'white', // White text color for dropdown items
                                '&:hover': {
                                  backgroundColor: '#388E3C', // Lighter green on hover
                                },
                              }}
                            >
                              {skill}
                            </MenuItem>
                          ))}
                        </Select>


                        <Button variant="contained" sx={{ ml: 2 }} onClick={handleAddSkill}>
                          Add
                        </Button>
                      </Box>
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
                    {error && (
                      <Grid item xs={12}>
                        <Typography color="error" variant="body2">
                          {error}
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="contained" color="primary" onClick={handlePrev}>
                        Previous
                      </Button>
                      <Button variant="contained" color="primary" type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
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
