/* eslint-disable no-unused-vars */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Sidebar from './components/Sidebar.jsx'
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider} from "react-redux";
import rootReducer from "./reducers/combineReducer";
import {configureStore} from "@reduxjs/toolkit"
import {Toaster} from "react-hot-toast";

const store=configureStore(
  {
    reducer:rootReducer,
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
     <App/>
     <Toaster/>
    </BrowserRouter>
    </Provider>
  </StrictMode>
);
