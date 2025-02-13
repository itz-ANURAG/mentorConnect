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
      dispatch(setLoading(true));

      // Call the backend endpoint to decode the cookie.
      const response = await axios.get(`${BACKEND_URL}/retrive/getToken`, { withCredentials: true });
      console.log(response);

      // Check that the response is successful and contains a token and user data
      if (
        response.status === 200 &&
        response.data.success &&
        response.data.token &&
        response.data.user
      ) {
        // Update auth slice with token and role
        dispatch(setToken(response.data.token));
        dispatch(setRole(response.data.role));

        // Update the corresponding slice based on the role
        if (response.data.role === "mentor") {
          dispatch(setMentorData(response.data.user));
        } else if (response.data.role === "mentee") {
          dispatch(setMenteeData(response.data.user));
        }
      } else {
        // If data is missing or unsuccessful, clear the auth state.
        console.log(" Unable to fetch whole data something is missing")
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
