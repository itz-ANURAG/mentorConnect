import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Sidebar from './components/Sidebar.jsx'
import './index.css';
import Form from './forms/exsmpleforms.jsx';
import CardStack from './components/CardStack.jsx';
import Layout from './pages/layoutexample.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookedSession from './pages/BookedSession.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <App/>
  </BrowserRouter>
);
