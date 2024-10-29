import React, { useState } from 'react';
import Navbar from '../components/NavbarLandingPage';
import { useSelector, useDispatch } from 'react-redux';

const Profile = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role); // Correctly accessing the role from Redux state

  // Define variables for mentee and mentor data
  let mentee;
  let mentor;

  if (role === "mentee") {
    mentee = useSelector((state) => state.mentee.data);
    console.log("Mentee Data:", mentee);
  } else if (role === "mentor") {
    mentor = useSelector((state) => state.mentor.data);
    console.log("Mentor Data:", mentor);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-700 flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <img
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                src="https://via.placeholder.com/150"
                alt="Profile"
              />
              <div className="ml-4">
                <h1 className="text-2xl font-semibold">
                  {role === 'mentor' ? 'John Doe (Mentor)' : 'Jane Doe (Mentee)'}
                </h1>
                <p className="text-gray-600">
                  {role === 'mentor' ? 'Senior Software Engineer at XYZ Corp' : 'Aspiring Web Developer'}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Body */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Section - Basic Info */}
            <div className="w-full md:w-1/3">
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h2 className="text-lg font-semibold mb-2">Basic Info</h2>
                <p><strong>Email:</strong> {role === 'mentor' ? mentor?.email : mentee?.email}</p>
                <p><strong>Location:</strong> {role === 'mentor' ? mentor?.location : mentee?.location}</p>
                {role === 'mentor' && <p><strong>Ratings:</strong> {mentor?.ratings}/5</p>}
              </div>

              {/* Job & Company (Shown only for Mentors) */}
              {role === 'mentor' && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Professional Info</h2>
                  <p><strong>Job Title:</strong> {mentor?.jobTitle}</p>
                  <p><strong>Company:</strong> {mentor?.company}</p>
                </div>
              )}
            </div>

            {/* Right Section - Bio, Summary, etc. */}
            <div className="w-full md:w-2/3">
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h2 className="text-lg font-semibold mb-2">About Me</h2>
                <p>
                  {role === 'mentor'
                    ? mentor?.bio || 'I am a software engineer with over 10 years of experience. I love helping others grow in their careers.'
                    : mentee?.bio || 'I am an aspiring web developer looking to connect with mentors and gain industry insights.'}
                </p>
              </div>

              {/* Additional Sections based on role */}
              {role === 'mentor' ? (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Upcoming Sessions</h2>
                  <p>No upcoming sessions yet.</p>
                </div>
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Registered Sessions</h2>
                  <p>No registered sessions yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
