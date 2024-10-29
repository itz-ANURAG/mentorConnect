/* eslint-disable no-unused-vars */

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate ,Navigate} from 'react-router-dom'; // Use react-router-dom for newer versions
import Profile from '../pages/userProfile';

const PrivateRoute = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    // useEffect(() => {
    //     if (!token) {
    //         console.log("No token, redirecting to home page");
    //         navigate('/'); // Redirect to home page if no token
    //     }
    // }, [token, navigate]); // Ensure the effect runs when token or navigate changes

    // Return the children components only if token exists
    if (token) {
        return <Outlet/>; // Do not render anything while redirecting
    }

    return <Navigate to='/' replace/>; // Render the protected components when the token is present
};

export default PrivateRoute;

