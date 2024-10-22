import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
// import profileReducer from "../slices/profileSlice";

// combining all reduces in one function for convinience
const rootReducer =combineReducers({
    auth:authReducer,
    // profile:profileReducer,
});

export default rootReducer;