/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from "./pages/Dashboard"
import LandingPage from './pages/LandingPage'
import ResetPassword from "./pages/ResetPassword"
import ChangePasswwordConfirm from "./components/ChangePasswordConfirm"
import UserUpProfile from './pages/UserUpProfile'
import SignUp from "./pages/SignUp"
import MentorSignup from './pages/signUpMentor'
import Login from './pages/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MentorSignup />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </Router>
    // <MentorSignup/>
  )
}

export default App
