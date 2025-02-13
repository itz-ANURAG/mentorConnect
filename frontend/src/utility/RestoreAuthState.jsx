// authUtils.js
import axios from "axios";
import { setToken, setRole, clearToken, setLoading } from "../slices/authSlice.js";
import { setMenteeData } from "../slices/menteeSlice.js";
import { setMentorData } from "../slices/mentorSlice.js";

/**
 * Attempts to restore authentication state from the backend.
 *
 * Checks local storage for an "isLoggedIn" flag, and if set,
 * sends an API call to decode the HTTP‑only cookie. If successful,
 * it updates the Redux auth state with token, role, and user data.
 *
 * @param {function} dispatch - Redux dispatch function.
 */
const restoreAuthState = async (dispatch) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // Check the local storage flag
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (isLoggedIn) {
    try {
      // Optionally set a loading state in Redux
      dispatch(setLoading(true));

      // Call your backend endpoint that decodes the cookie.
      // Make sure to include credentials so the cookie is sent.
      const response = await axios.get(`${BACKEND_URL}/retrive/getToken`, { withCredentials: true });
      console.log(response);
      // If the response returns valid token information...
      if (response.status === 200 && response.data.token) {
        // Set token and role in auth slice
        dispatch(setToken(response.data.token));
        dispatch(setRole(response.data.role));

        // Set user data in mentor or mentee slice based on role
        if (response.data.role === "mentor") {
          dispatch(setMentorData(response.data.user));
        } else if (response.data.role === "mentee") {
          dispatch(setMenteeData(response.data.user));
        }
      } else {
        // If no valid auth data is returned, clear the flag and Redux state.
        localStorage.removeItem("isLoggedIn");
        dispatch(clearToken());
      }
    } catch (error) {
      console.error("Error restoring auth state:", error);
      localStorage.removeItem("isLoggedIn");
      dispatch(clearToken());
    } finally {
      dispatch(setLoading(false));
    }
  }
};

export default restoreAuthState;