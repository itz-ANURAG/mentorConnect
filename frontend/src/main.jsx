import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import App from './App.jsx';
import './index.css';
import MentorSearchPage from './pages/SearchPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <MentorSearchPage/>
  </StrictMode>,
);
