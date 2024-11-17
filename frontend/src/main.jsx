import { StrictMode } from 'react'; // React wrapper to catch potential problems in an application
import { createRoot } from 'react-dom/client'; // For rendering the React app in the DOM
import App from './App.jsx'; // Main application component
import './index.css'; // Global CSS styles
import { BrowserRouter } from 'react-router-dom'; // Provides routing capabilities
import { Provider } from "react-redux"; // React-Redux provider to pass the Redux store to components
import rootReducer from "./reducers/combineReducer"; // Root reducer combining all reducers
import { configureStore } from "@reduxjs/toolkit"; // Configures the Redux store
import { Toaster } from "react-hot-toast"; // Toast notifications
import 'mdb-react-ui-kit/dist/css/mdb.min.css'; // Material Design Bootstrap styles
import "@fortawesome/fontawesome-free/css/all.min.css"; // FontAwesome icons

// Configures the Redux store using the root reducer
const store = configureStore({
  reducer: rootReducer, // Combines all the slices/reducers
});

// Renders the root React application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> 
      {/* Makes the Redux store available to all components */}
        <BrowserRouter> 
          {/* Enables routing in the application */}
          <App /> 
          {/* Main application component */}
          <Toaster /> 
          {/* Displays toast notifications */}
        </BrowserRouter>
    </Provider>
  </StrictMode>
);
