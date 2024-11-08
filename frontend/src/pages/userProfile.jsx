/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavbarLandingPage';
import { useSelector, useDispatch } from 'react-redux';
import CustomSpinner from "../components/CustomSpinner";
import { setLoading } from "../slices/authSlice"; 
import axios from 'axios';

const Profile = () => {
  const [menteeData, setMenteeData] = useState(null); // State for mentee data
  const [error, setError] = useState(null); // State for error handling
  const role = useSelector((state) => state.auth.role); // Get role from Redux
  const menteeId = useSelector((state) => state.mentee.data?._id || state.mentee.data?.id); // Mentee ID from Redux
  const loading = useSelector((state) => state.auth.loading); // Get loading status
  const dispatch = useDispatch();
  console.log(menteeId);

  useEffect(() => {
    
    const fetchMenteeData = async () => {
      if (role === 'mentee') {
        dispatch(setLoading(true));
        try {
          const response = await axios.get(`http://localhost:3000/mentee/${menteeId}`);
          console.log(response.data);
          setMenteeData(response.data.mentee); // Set the mentee data
        } catch (error) {
          console.error("Error fetching mentee details:", error);
          setError("Error fetching mentee details");
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    fetchMenteeData();
  }, [role, menteeId, dispatch]);

  // Display error or loading states
  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <CustomSpinner />; // Use CustomSpinner to indicate loading state
  }

  if (role !== 'mentee') {
    return <div>Access Denied. Only mentees can view this page.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 rounded-lg shadow-2xl max-w-screen min-h-screen w-full overflow-hidden">
        {/* Profile Header */}
        <div className="w-full p-6 rounded-lg shadow-inner">
          {/* Profile Picture and Info */}
          <div className="flex items-center bg-gray-100 p-6 rounded-lg shadow-lg ">
            <img
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
              src={menteeData?.profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              style={{ marginTop: '-48px' }}
            />
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {menteeData?.firstName} {menteeData?.lastName}
              </h1>
              <p className="text-lg text-gray-600">
                {menteeData?.jobTitle || 'Job Title not available'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Body */}
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Left Sidebar - Basic Info and Contact */}
          <div className="w-full md:w-1/3 bg-gray-100 p-4 rounded-lg shadow-inner">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Contact Info</h2>
              <p><strong>Email:</strong> {menteeData?.email || 'No email available'}</p>
            </div>

            {/* About Section */}
            <div className="bg-gray-100 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">About Me</h2>
              <p className="text-gray-700">{menteeData?.bio || 'No bio available for this user.'}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Language</h2>
              <p>{menteeData?.language || 'No language available'}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">LinkedIn</h2>
              <a href={menteeData?.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Profile
              </a>
            </div>
          </div>

          {/* Right Section - Bio, Summary, and Sessions */}
          {/* Additional components can go here */}
        </div>
      </div>
    </>
  );
};

export default Profile;
