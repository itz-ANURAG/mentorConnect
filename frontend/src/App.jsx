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

function App() {
  const [count, setCount] = useState(0)

  return (
      <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/signUpMentee' element={<SignUp/>}/>
          <Route path='/signUpMentor' element={<SignUpMentor/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/profile' element={<Dashboard/>}/>
          <Route path='/resetPassword' element={<ResetPassword/>}/>
          <Route path='/reset-password/:token' element={<ChangePasswordConfirm />} />
          <Route path="/searchPage" element={<SearchPage />} />
      </Routes>
    // <MentorSignup/>
  )
}

export default App
