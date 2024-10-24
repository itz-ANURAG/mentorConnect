/* eslint-disable no-unused-vars */
import * as React from 'react';
import { useNavigate, NavLink } from 'react-router-dom'; // Import NavLink or useNavigate
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
import { useSelector,useDispatch } from 'react-redux';
import { clearToken } from '../slices/authSlice';

const settings = [
  { name: 'Profile', path: '/profile' },
  { name: 'Community', path: '/community' },
  { name: 'Settings', path: '/settings' },
  { name: 'Dashboard', path: '/dashboard' },
];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const token = useSelector((state) => state.auth.token); // Check for token from redux state
  const dispatch = useDispatch();
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = () => {
    console.log('User signed out');
    // Navigate to login page or clear user session
    dispatch(clearToken());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="" className="bg-black">
        <Toolbar disableGutters sx={{ height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <NavLink to='/'>
              <img src={logo} alt="Logo" style={{ height: '90px', width: 'auto' }} />
          </NavLink>
          
           {/* Individual Buttons for Desktop */}
           <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '30px', flexGrow: 1, justifyContent: 'center' }}>
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
          </Box>

          {/* Avatar Menu for Logged-in Users */}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            {!token ? (
              // Show SignUp/Login button if not logged in
              <Button
                onClick={() => navigate('/signUpMentee')}
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
                SignUp/Login
              </Button>
            ) : (
              // Show avatar and menu if logged in
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User Avatar" src="https://randomuser.me/api/portraits/men/32.jpg"  />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                      {/* NavLink for each menu item */}
                      <NavLink
                        to={setting.path}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <Typography textAlign="center">{setting.name}</Typography>
                      </NavLink>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={handleSignOut}>
                    <Typography textAlign="center">Sign Out</Typography>
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

