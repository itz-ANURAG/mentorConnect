// Importing necessary modules and components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // React Router for navigation
import Layout from './pages/Layout'; // Common layout for certain routes
import Dashboard from './pages/Dashboard'; // Dashboard page for mentors
import MentorSlots from './pages/MentorSlots'; // Mentor slot details page
import LandingPage from './pages/LandingPage'; // Landing page of the application
import SignUp from './pages/SignUpMentee'; // Sign-up page for mentees
import SignUpMentor from './pages/signUpMentor'; // Sign-up page for mentors
import Login from './pages/Login'; // Login page
import ResetPassword from './pages/ResetPassword'; // Password reset page
import GoogleCallback from './components/GoogleCallback'; // Callback page for Google OAuth
import MentorSearchPage from './pages/MentorSearchPage'; // Search page for finding mentors
import Profile from './pages/userProfile'; // User profile page
import PrivateRoute from './components/PrivateRoute'; // Component to guard private routes
import ChangePasswordConfirm from './components/ChangePasswordConfirm'; // Password change confirmation page
import UpdateMentorSlots from './pages/UpdateMentorSlots'; // Page to manage mentor slots
import UpcomingSessions from './pages/UpcomingSessions'; // Mentor's upcoming sessions
import UserRegisteredSession from './pages/UserRegisteredSession'; // Sessions registered by the user
import EditProfile from './pages/EditProfile'; // Page for editing user profile
import GeneralPost from './pages/GeneralPost'; // General post page
import NotFound from "./pages/NotFound"; // 404 Not Found page
import ContactUs from "./pages/ContactUs"; // Contact Us page
import About from "./components/About"; // About page
import CommunityPage from "./pages/CommunityPage"; // Community page
import Room from "./pages/Room"; // Video call room page
import CreatePostCommunity from './components/CreatePostCommunity'; // Create post in community section
import CommunityPost from "./pages/CommunityPost"; // View community post page
import Feedback from "./components/Feedback"; // Feedback submission page
import CreatePostGeneral from './components/CreatePostGeneral'; // Create post in general post section

// Main application component defining routes
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} /> {/* Landing page */}
      <Route path="/signUpMentee" element={<SignUp />} /> {/* Sign-up page for mentees */}
      <Route path="/signUpMentor" element={<SignUpMentor />} /> {/* Sign-up page for mentors */}
      <Route path="/login" element={<Login />} /> {/* Login page */}
      <Route path="/resetPassword" element={<ResetPassword />} /> {/* Password reset */}
      <Route path="/searchPage" element={<MentorSearchPage />} /> {/* Mentor search page */}
      <Route path="/post" element={<GeneralPost />} /> {/* General posts */}
      <Route path="/contact" element={<ContactUs />} /> {/* Contact Us page */}
      <Route path="/about" element={<About />} /> {/* About page */}
      <Route path='/video/join/:token' element={<Room />} /> {/* Video call room */}
      <Route path="/feedback/:token" element={<Feedback />} /> {/* Feedback submission */}
      <Route path="/google-callback/:token" element={<GoogleCallback />} /> {/* Google OAuth callback */}
      
      {/* Private routes (requires authentication) */}
      <Route element={<PrivateRoute />}>
        <Route path="/reset-password/:token" element={<ChangePasswordConfirm />} /> {/* Password reset confirmation */}
        <Route path="/profile" element={<Profile />} /> {/* User profile */}
        <Route element={<Layout />}>
          <Route path="/mentors/:id" element={<Dashboard />} /> {/* Mentor dashboard */}
          <Route path="/mentors/:id/slots" element={<MentorSlots />} /> {/* Mentor slot details */}
          <Route path="/mentors/:id/manage-slots" element={<UpdateMentorSlots />} /> {/* Manage mentor slots */}
          <Route path='/mentors/:id/upComing-Sessions' element={<UpcomingSessions />} /> {/* Mentor's upcoming sessions */}
          <Route path='/profile/update' element={<EditProfile />} /> {/* Edit user profile */}
        </Route>
        <Route path="/userRegisteredSession" element={<UserRegisteredSession />} /> {/* Registered sessions */}
        <Route path="/community" element={<CommunityPage />} /> {/* Community page */}
        <Route path="/communityPost" element={<CommunityPost />} /> {/* Community posts */}
        <Route path="/createPost" element={<CreatePostCommunity />} /> {/* Create community post */}
        <Route path="/createPostGeneral" element={<CreatePostGeneral />} /> {/* Create general post */}
      </Route>

      {/* Catch-all route for undefined paths */}
      <Route path="*" element={<NotFound />} /> {/* 404 Not Found page */}
    </Routes>
  );
}

export default App;
