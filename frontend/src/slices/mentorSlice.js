import { createSlice } from '@reduxjs/toolkit';

// Define a Redux slice for managing mentor-related data
export const mentorSlice = createSlice({
  name: 'mentor', // Name of the slice
  initialState: {
    data: null, // Initial state: holds mentor-specific data
  },
  reducers: {
    // Action to set mentor data in the state
    setMentorData: (state, action) => {
      state.data = action.payload; // Update the data with the payload
    },
    // Action to clear mentor data in the state
    clearMentorData: (state) => {
      state.data = null; // Reset the data to null
    },
  },
});

// Export the actions to be used in components or thunks
export const { setMentorData, clearMentorData } = mentorSlice.actions;

// Export the reducer to be included in the store
export default mentorSlice.reducer;
