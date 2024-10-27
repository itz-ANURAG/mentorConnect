import { createSlice } from '@reduxjs/toolkit';

export const mentorSlice = createSlice({
  name: 'mentor',
  initialState: {
    data: null, // Will hold mentor-specific data
  },
  reducers: {
    setMentorData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setMentorData } = mentorSlice.actions;
export default mentorSlice.reducer;
