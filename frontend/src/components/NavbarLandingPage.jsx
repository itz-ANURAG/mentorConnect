/* eslint-disable no-unused-vars */
import * as React from 'react';
import { useNavigate } from 'react-router';
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
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon
import Drawer from '@mui/material/Drawer'; // Import Drawer for the sidebar
import logo from '../assets/logo.png';

const settings = ['Profile', 'Community', 'Settings', 'Dashboard', 'Logout', 'Baad me Sochenge'];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false); // Drawer state for mobile menu

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="" className="bg-black">
        <Toolbar disableGutters sx={{ height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <a href='/'>
          <img src={logo} alt="Logo" style={{ height: '90px', width: 'auto' }} />
          </a>
          {/* Hamburger Menu Icon for mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ marginRight: '10px' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Drawer for Mobile Menu */}
          <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
            <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', padding: '10px' }}>
              {['Profile','Mentors', 'Post', 'Contact', 'About'].map((text) => (
                <Button
                  key={text}
                  onClick={() => console.log(`${text} clicked`)}
                  sx={{
                    color: 'black',
                    fontSize: '18px',
                    padding: '10px 20px',
                    textTransform: 'none',
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}
                >
                  {text}
                </Button>
              ))}
              
            </Box>
          </Drawer>

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

          {/* Avatar Menu for Desktop */}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;