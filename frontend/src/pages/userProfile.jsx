import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavbarLandingPage';
import { useSelector, useDispatch } from 'react-redux';
import CustomSpinner from "../components/CustomSpinner";
import { setLoading } from "../slices/authSlice";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from 'axios';
import Nouser from '../assets/Nouser.png';

const Profile = () => {
  const [menteeData, setMenteeData] = useState(null);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const role = useSelector((state) => state.auth.role);
  const menteeId = useSelector((state) => state.mentee.data?._id || state.mentee.data?.id);
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMenteeData = async () => {
      if (role === 'mentee') {
        dispatch(setLoading(true));
        try {
          const response = await axios.get(`http://localhost:3000/mentee/${menteeId}`);
          setMenteeData(response.data.mentee);
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

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <CustomSpinner />;
  }

  if (role !== 'mentee') {
    return <div>Access Denied. Only mentees can view this page.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-red-600 via-pink-500 to-black">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={menteeData?.profilePic || Nouser}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = Nouser; }}
                />
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {menteeData?.firstName} {menteeData?.lastName}
              </h1>
              <p className="text-gray-600">{menteeData?.jobTitle || 'Job Title not available'}</p>

              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>{menteeData?.location || 'Location not available'}</span>
              </div>

              <div className="text-gray-700">{menteeData?.bio || 'No bio available for this user.'}</div>

              <div className="space-y-3 py-4">
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-gray-600" />
                  <a href={`mailto:${menteeData?.email}`} className="text-blue-600 hover:underline">
                    {menteeData?.email || 'No email available'}
                  </a>
                </div>

                <div className="flex items-center space-x-2">
                  <FaPhoneAlt className="text-gray-600" />
                  <a href={`tel:${menteeData?.phone}`} className="text-blue-600 hover:underline">
                    {menteeData?.phone || 'No phone available'}
                  </a>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  aria-expanded={isExpanded}
                >
                  <span>Additional Information</span>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {menteeData?.skills?.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;