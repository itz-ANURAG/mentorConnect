import React  from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate,Navigate} from 'react-router-dom'; // Use react-router-dom for newer versions

const PrivateRoute = () => {
    // const Navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    // Return the children components only if token exists
    console.log(token)
    if (token) {
        return <Outlet/>; // Do not render anything while redirecting
    }
    return <Navigate to='/login' replace/>; // Render the protected components when the token is present
};

export default PrivateRoute;

