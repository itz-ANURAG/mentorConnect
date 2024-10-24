/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from '../src/pages/LandingPage'
import SignUp from './pages/SignUp'
import SignUpMentor from './pages/signUpMentor'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute'
import ChangePasswordConfirm from './components/ChangePasswordConfirm'
import SearchPage from "./pages/SearchPage"; // Assuming SearchPage needs to be included

import Profile from './pages/userProfile';
import Layout from './pages/layoutexample'
function App() {
  const [count, setCount] = useState(0)

  return (
      <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/signUpMentee' element={<SignUp/>}/>
          <Route path='/signUpMentor' element={<SignUpMentor/>}/>
          <Route path='/login' element={<Login/>}/>
          {/* <PrivateRoute>
              <Route path='/profile' element={<Profile/>}/>
          </PrivateRoute> */}
          <Route path='/resetPassword' element={<ResetPassword/>}/>
          <Route path='/reset-password/:token' element={<ChangePasswordConfirm />} />
          <Route path="/searchPage" element={<SearchPage />} />
          <Route element={<PrivateRoute/>}>
              <Route path='/profile' element={<Profile/>}/>
          </Route>
      </Routes>
    // <MentorSignup/>
  )
}

export default App
