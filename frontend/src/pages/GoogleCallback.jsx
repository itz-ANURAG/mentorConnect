/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setLoading, setRole, setToken } from '../slices/authSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { setMenteeData } from '../slices/menteeSlice'
import { CustomSpinner } from '../components/CustomSpinner';

const GoogleCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state)=>state.auth.loading)
    const { token } = useParams(); // Destructure token from useParams

    useEffect(() => {
        async function fetchData() {
            if (token) {
                const modifiedToken = token.replace(/\-/g, '.'); // Modify token correctly here
                console.log("modifiedToken", modifiedToken);
                try {
                    dispatch(setLoading(true))
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
                    dispatch(setLoading(false))
                    navigate('/profile');
                } catch (error) {
                    dispatch(setLoading(false))
                    console.log(error);
                }
            } else {
                dispatch(setLoading(false))
                navigate('/signUpMentee');
            }
        }
    
        fetchData();
    }, [token, dispatch, navigate]);
    

    return(
        <>
        
        {
            loading ? <CustomSpinner/> :
            <></>
        }
        </>
    )
};

export default GoogleCallback;
