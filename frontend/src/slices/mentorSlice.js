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
    clearMentorData:(state)=>{
      state.data=null;
    },
  },
});

export const { setMentorData ,clearMentorData} = mentorSlice.actions;
export default mentorSlice.reducer;
