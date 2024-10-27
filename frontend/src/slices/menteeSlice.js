import { createSlice } from '@reduxjs/toolkit';

export const menteeSlice = createSlice({
  name: 'mentee',
  initialState: {
    data: null, // Will hold mentee-specific data
  },
  reducers: {
    setMenteeData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setMenteeData } = menteeSlice.actions;
export default menteeSlice.reducer;
