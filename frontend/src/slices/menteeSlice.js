import { createSlice } from '@reduxjs/toolkit';

// Define a Redux slice for managing mentee-related data
export const menteeSlice = createSlice({
  name: 'mentee', // Name of the slice
  initialState: {
    data: null, // Initial state: holds mentee-specific data
  },
  reducers: {
    // Action to set mentee data in the state
    setMenteeData: (state, action) => {
      state.data = action.payload;
    },
    // Action to clear mentee data in the state
    clearMenteeData: (state) => {
      state.data = null;
    }
  },
});

// Export the actions to be used in components or thunks
export const { setMenteeData, clearMenteeData } = menteeSlice.actions;

// Export the reducer to be included in the store
export default menteeSlice.reducer;
