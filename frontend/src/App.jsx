/* eslint-disable no-unused-vars */
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from "./pages/Dashboard"
import LandingPage from './pages/LandingPage'
import ResetPassword from "./pages/ResetPassword"
import ChangePasswwordConfirm from "./components/ChangePasswordConfirm"
import SignUp from "./pages/SignUp"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SignUp/>
    </>
  )
}

export default App
