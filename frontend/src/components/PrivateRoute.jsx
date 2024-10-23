import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    // If there's no token, redirect to the home page
    if (!token) {
        navigate('/');
        return null; // Return null while navigating
    }

    // If there is a token, return the children components
    return <>{children}</>;
}

export default PrivateRoute;
