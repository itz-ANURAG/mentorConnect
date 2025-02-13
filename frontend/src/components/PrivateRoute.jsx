import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import restoreAuthState from '../utility/RestoreAuthState';
import CustomSpinner from './CustomSpinner';

const PrivateRoute = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

//  If session is stored or Coockies are set restore the session data
    useEffect(() => {
        const restoreAuth = async () => {
            if (!token) {
                console.log("Restoring authentication state...");
                await restoreAuthState(dispatch);
            }
            setIsAuthChecked(true); // Ensure we update state after checking auth
        };

        restoreAuth();
    }, [dispatch, token]);

    // Wait until auth state is checked before rendering anything
    if (!isAuthChecked) {
        return <div><CustomSpinner/></div>; // Show a loading indicator while restoring auth
    }

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
