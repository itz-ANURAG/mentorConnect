
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import mentorReducer from "../slices/mentorSlice";
import menteeReducer from "../slices/menteeSlice";

// Combining all reducer
const rootReducer = combineReducers({
    auth: authReducer,
    mentor: mentorReducer,
    mentee: menteeReducer,
    // profile: profileReducer, // If needed later
});

export default rootReducer;
