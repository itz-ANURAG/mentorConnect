import { createSlice } from "@reduxjs/toolkit";

// Initial state of the auth slice
const initialState = {
    token: null,    // Stores the authentication token
    loading: false, // Indicates whether an authentication-related operation is in progress
    role: null      // Stores the role of the user (e.g., mentor, mentee)
};

// Create an authentication slice
const authSlice = createSlice({
    name: "auth",           // Name of the slice
    initialState,           // Initial state object
    reducers: {             // Reducers to handle state transitions
        // Sets the token in the state
        setToken(state, action) {
            state.token = action.payload;
        },
        // Updates the loading status
        setLoading(state, action) {
            state.loading = action.payload;
        },
        // Clears the token from the state
        clearToken(state) {
            state.token = null;
            // Uncomment if token removal from local storage is needed
            // localStorage.removeItem("token");
        },
        // Sets the role of the user
        setRole(state, action) {
            state.role = action.payload;
        }
    },
});

// Exporting action creators and reducer
export const { setToken, setLoading, clearToken, setRole } = authSlice.actions;
export default authSlice.reducer;
