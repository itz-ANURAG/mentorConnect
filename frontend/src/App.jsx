/* eslint-disable no-unused-vars */
// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import MentorSlots from './pages/MentorSlots';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import SignUpMentor from './pages/signUpMentor';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import GoogleCallback from './pages/GoogleCallback';
import MentorSearchPage from './pages/MentorSearchPage';
import Profile from './pages/userProfile';
import PrivateRoute from './components/PrivateRoute';
import ChangePasswordConfirm from './components/ChangePasswordConfirm';
import UpdateMentorSlots from './pages/UpdateMentorSlots';
import UpcomingSessions from './pages/UpcomingSessions';
import UserRegisteredSession from './pages/UserRegisteredSession';
import EditProfile from './pages/EditProfile';
import GeneralPost from './pages/GeneralPost';
import NotFound from "./pages/NotFound"
import ContactUs from "./pages/ContactUs"
import About from "./components/About"
import CommunityPage from "./pages/CommunityPage"
import Room from "./pages/Room"
import CreatePostCommunity from './components/CreatePostCommunity';
import CommunityPost from "./pages/CommunityPost"
import Feedback from "./components/Feedback"
import CreatePostGeneral from './components/CreatePostGeneral';
import BlockedUsers from './pages/BlockedUsers';


function App() {
  return (
    <Routes>
       <Route path="/" element={<LandingPage />} />
      <Route path="/signUpMentee" element={<SignUp />} />
      <Route path="/signUpMentor" element={<SignUpMentor />} />
      <Route path="/login" element={<Login />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/searchPage" element={<MentorSearchPage />} />
      <Route path="/post" element={<GeneralPost />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/about" element={<About />} />
      <Route path='/video/join/:token' element={<Room />} />
      <Route path="/feedback/:token" element={<Feedback />} />
      
      <Route path="/google-callback/:token" element={<GoogleCallback />} />
      <Route element={<PrivateRoute />}>
        <Route path="/reset-password/:token" element={<ChangePasswordConfirm />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<Layout />}>
          <Route path="/mentors/:id" element={<Dashboard />} />
          <Route path="/mentors/:id/slots" element={<MentorSlots />} />
          <Route path="/mentors/:id/manage-slots" element={<UpdateMentorSlots/>} />
          <Route path='/mentors/:id/upComing-Sessions' element={<UpcomingSessions />} />
          <Route path='/profile/update' element={<EditProfile />} />
          <Route path='/blockedUsers' element={<BlockedUsers />} />
        </Route>
        <Route path="/userRegisteredSession" element={<UserRegisteredSession />} />
        <Route path ="/community" element={<CommunityPage/>} />
        <Route path ="/communityPost" element={<CommunityPost/>} />
        <Route path ="/createPost" element={<CreatePostCommunity/>} />
        <Route path ="/createPostGeneral" element={<CreatePostGeneral/>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
