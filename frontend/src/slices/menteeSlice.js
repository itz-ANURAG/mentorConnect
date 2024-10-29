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
    clearMenteeData:(state)=>{
      state.data=null;
    }
  },
});

export const { setMenteeData ,clearMenteeData} = menteeSlice.actions;
export default menteeSlice.reducer;
