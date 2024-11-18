import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

// Create a new socket connection to the server
const socket = io('http://localhost:3000');

// Define a slice for managing socket-related state
const socketSlice = createSlice({
  name: 'socket', // Name of the slice
  initialState: { 
    instance: socket, // Initial state holds the socket connection instance
  },
  reducers: {
    // You can add more reducers if needed to manage socket-related state in the future
  },
});

// Selector to access the socket instance from the state
export const selectSocket = (state) => state.socket.instance;

// Export the reducer to be included in the Redux store
export default socketSlice.reducer;
