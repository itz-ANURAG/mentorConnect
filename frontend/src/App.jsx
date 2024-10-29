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

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signUpMentee" element={<SignUp />} />
      <Route path="/signUpMentor" element={<SignUpMentor />} />
      <Route path="/login" element={<Login />} />
      <Route path="/google-callback/:token" element={<GoogleCallback />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/reset-password/:token" element={<ChangePasswordConfirm />} />
      <Route path="/searchPage" element={<MentorSearchPage />} />

      {/* Use Layout wrapper for routes with Navbar and Footer */}
      <Route element={<Layout />}>
        <Route path="/mentors/:id" element={<Dashboard />} />
        <Route path="/mentors/:id/slots" element={<MentorSlots />} />
        {/* Mentor slots management route */}
        <Route path="/mentors/:id/manage-slots" element={<UpdateMentorSlots/>} />
        <Route path='/mentors/:id/upComing-Sessions' element={<UpcomingSessions/>}/>
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
