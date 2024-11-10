
import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const socketSlice = createSlice({
  name: 'socket',
  initialState: { instance: socket },
  reducers: {
    // You can add more reducers if needed to manage socket-related state
  },
});

export const selectSocket = (state) => state.socket.instance;

export default socketSlice.reducer;
