import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import mentorReducer from "../slices/mentorSlice";
import menteeReducer from "../slices/menteeSlice";
import socketReducer from "../slices/socketSlice";

// Combining all reducer
const rootReducer = combineReducers({
    auth: authReducer,
    mentor: mentorReducer,
    mentee: menteeReducer,
    socket: socketReducer,
    // profile: profileReducer, // If needed later
});

export default rootReducer;
