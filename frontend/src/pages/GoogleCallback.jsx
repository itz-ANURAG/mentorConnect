import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setToken } from '../slices/authSlice';
import { toast } from 'react-hot-toast';

const GoogleCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams(); // Destructure token from useParams

    useEffect(() => {
        if (token) {
            const modifiedToken = token.replace(/\./g, '-'); // Modify token correctly here
            console.log(modifiedToken);
            dispatch(setToken(modifiedToken));
            toast.success("Signed in successfully");
            navigate('/profile');
        } else {
            navigate('/signUpMentee');
        }
    }, [token, dispatch, navigate]);

    return <div>Hello</div>;
};

export default GoogleCallback;
