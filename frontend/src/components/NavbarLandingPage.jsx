
// Import necessary dependencies
import * as React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import logo from '../assets/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { clearToken } from '../slices/authSlice';
import { clearMenteeData } from '../slices/menteeSlice';
import { clearMentorData } from '../slices/mentorSlice';


function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const dispatch = useDispatch();

  // State and ID extraction
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const mentorData = useSelector((state) => state.mentor.data);
  const menteeData = useSelector((state) => state.mentee.data);
  console.log(mentorData);
  console.log(menteeData);

  // Determine the avatar source based on the role and data availability
  const avatarSrc = role === 'mentor' && mentorData?.profilePicture
    ? mentorData.profilePicture
    : role === 'mentee' && menteeData?.profilePicture
    ? menteeData.profilePicture
    : 'https://randomuser.me/api/portraits/men/32.jpg'; // Default user image

  // Track and set mentorId only if role is mentor and mentorData is loaded
  const mentorId = mentorData?._id;

  // Conditional settings for mentee and mentor with dynamic ID path
  const settings = role === 'mentee'
    ? [
        { name: 'Profile', path: '/profile' },
        { name: 'EditProfile', path: '/profile/update' },
        { name: 'Communities', path: '/community' },
        { name: 'Create Post', path: '/createPostGeneral' },
        { name: 'Settings', path: '/settings' },
        { name: 'Registered Session', path: '/userRegisteredSession' },
      ]
    : role === 'mentor' && mentorId
    ? [
        { name: 'Dashboard', path: `/mentors/${mentorId}` },
        { name: 'My Community', path: '/communityPost'},
        { name: 'Create Post', path: '/createPostGeneral'},
        { name: 'Manage-Slots', path: `/mentors/${mentorId}/manage-slots` },
        { name: 'ManageSessions', path: `/mentors/${mentorId}/manageSessions`},
        { name: 'EditProfile', path: '/profile/update' },
        { name: 'BlockedUsers', path: '/blockedUsers' },
      ]
    : [];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = () => {
    dispatch(clearToken());
    dispatch(clearMenteeData());
    dispatch(clearMentorData());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="" className="bg-black">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <NavLink to="/">
            <img src={logo} alt="Logo" style={{ height: '90px', width: 'auto' }} />
          </NavLink>

          {/* Individual Buttons for Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '30px', flexGrow: 1, justifyContent: 'center' }}>
            <NavLink to='/searchPage'>
              <Button
                onClick={() => console.log('Mentors clicked')}
                className="hover:bg-slate-800"
                sx={{
                  color: 'white',
                  fontSize: '20px',
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  borderRadius: '10px',
                  textTransform: 'none',
                }}
              >
                Mentors
              </Button>
            </NavLink>
            <NavLink to='/post'>
            <Button
              onClick={() => console.log('Post clicked')}
              className="hover:bg-slate-800"
              sx={{
                color: 'white',
                fontSize: '20px',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                borderRadius: '10px',
                textTransform: 'none',
              }}
            >
              Post
            </Button>
            </NavLink>
            <NavLink to='/contact'>
            <Button
              onClick={() => console.log('Contact clicked')}
              className="hover:bg-slate-800"
              sx={{
                color: 'white',
                fontSize: '20px',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                borderRadius: '10px',
                textTransform: 'none',
              }}
            >
              Contact
            </Button>
            </NavLink>
            <NavLink to='/about'>
            <Button
              onClick={() => console.log('About clicked')}
              className="hover:bg-slate-800"
              sx={{
                color: 'white',
                fontSize: '20px',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                borderRadius: '10px',
                textTransform: 'none',
              }}
            >
              About
            </Button>
            </NavLink>
          </Box>

          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            {!token ? (
              <Button onClick={() => navigate('/signUpMentee')} sx={{ color: 'white', fontSize: '20px' }}>
                SignUp/Login
              </Button>
            ) : (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar alt="User Avatar" src={avatarSrc} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                      <NavLink to={setting.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography>{setting.name}</Typography>
                      </NavLink>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={handleSignOut}>
                    <Typography>Sign Out</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
