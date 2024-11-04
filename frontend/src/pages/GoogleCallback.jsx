import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setRole, setToken } from '../slices/authSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { setMenteeData } from '../slices/menteeSlice';

const GoogleCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams(); // Destructure token from useParams

    useEffect(() => {
        async function fetchData() {
            if (token) {
                const modifiedToken = token.replace(/\-/g, '.'); // Modify token correctly here
                console.log("modifiedToken", modifiedToken);
                try {
                    const response = await axios.get('http://localhost:3000/api/google-check', {
                        headers: {
                            Authorization: `Bearer ${modifiedToken}`,
                        },
                    });
                    dispatch(setToken(modifiedToken));
                    toast.success("Signed in successfully");
                    console.log(response.data.data);
                    dispatch(setRole("mentee"));
                    dispatch(setMenteeData(response.data.data));
                    navigate('/profile');
                } catch (error) {
                    console.log(error);
                }
            } else {
                navigate('/signUpMentee');
            }
        }
    
        fetchData();
    }, [token, dispatch, navigate]);
    

    return <div>Hello</div>;
};

export default GoogleCallback;
