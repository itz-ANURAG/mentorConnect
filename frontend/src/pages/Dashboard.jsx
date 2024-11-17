import React, { useState, useEffect } from 'react';
import { Avatar, Chip, Card, CardContent, Typography, IconButton, Button, Tooltip } from '@mui/material';
import { LocationOn, Star, CheckCircle, AccessTime, Phone, Group } from '@mui/icons-material';
import Testimonial from '../components/Testimonial';
import { NavLink, useParams, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [tooltipOpen, setTooltipOpen] = useState(false); // State for controlling tooltip visibility
  const [showMore, setShowMore] = useState(false); // State to toggle skills view
  const { id } = useParams(); // Getting mentor id from URL params
  const [mentor, setMentor] = useState(null); // State to store mentor details
  const [loading, setLoading] = useState(true); // Loading state for fetching mentor data
  const [error, setError] = useState(null); // Error state for handling API errors
  const [communityJoined, setCommunityJoined] = useState(false); // State to track community join status

  // Getting logged-in user (mentor and mentee) and token from Redux store
  const loggedMentorId = useSelector((state) => state.mentor.data?._id);
  const loggedMenteeId = useSelector((state) => state.mentee.data?._id);
  const token = useSelector((state) => state.auth.token);

  // Fetching mentor details on component mount or id change
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/mentors/${id}`);
        setMentor(response.data.mentor); // Storing fetched mentor data in state
      } catch (error) {
        console.error("Error fetching mentor details:", error);
        setError("Error fetching mentor details"); // Handling error
      } finally {
        setLoading(false); // Setting loading to false after fetching data
      }
    };

    fetchMentor();
  }, [id]);

  // Checking if the logged-in mentee is already in the mentor's community
  useEffect(() => {
    const checkCommunityStatus = async () => {
      if (loggedMenteeId) {
        try {
          const response = await axios.get(`${BACKEND_URL}/community/${id}/check-mentee/${loggedMenteeId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCommunityJoined(response.data.isMember); // Updating community join status
        } catch (error) {
          console.error("Error checking community status", error);
        }
      }
    };
    checkCommunityStatus();
  }, [id, loggedMenteeId, token]);

  // Handling community join functionality
  const joinCommunity = async () => {
    try {
      if (!token) {
        toast.error("Please log in first."); // Prompting login if no token
        return;
      }

      // Checking and joining community via backend API
      const response = await axios.get(`${BACKEND_URL}/community/${id}/check-join`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.joined) {
        setCommunityJoined(true); // Updating community status if successfully joined
        toast.success(response.data.message);
      } else {
        toast.error("Unable to join community");
      }
    } catch (error) {
      console.error("Error joining community:", error);
      toast.error("Error joining community.");
    }
  };

  // Displaying loading, error, or mentor info if available
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!mentor) return <p>No Mentor Found.....</p>;

  // Default skills in case no skills are provided by mentor
  const allSkills = mentor.skills && mentor.skills.length > 0 
    ? mentor.skills 
    : ['React', 'Node.js', 'JavaScript', 'HTML/CSS', 'MongoDB', 
       'Express.js', 'Tailwind CSS', 'Material UI', 'TypeScript', 
       'GraphQL', 'Redux', 'Next.js'];

  // Toggling the tooltip visibility for response time info
  const handleTooltipOpen = () => setTooltipOpen(!tooltipOpen);
  const handleTooltipClose = () => setTooltipOpen(false);

  // Skills to show (toggle between showing all skills or the first 6)
  const skillsToShow = showMore ? allSkills : allSkills.slice(0, 6);

  return (
    <>
      <div className="w-full h-screen p-4">
        <div className="bg-blue-900 h-1/3 relative flex items-end">
          <div className="absolute left-4 -bottom-12">
            <Avatar
              alt={mentor.name}
              src={mentor.profilePicture}
              className="w-40 h-40 border-4 border-white"
              sx={{ width: 160, height: 160 }}
            />
          </div>
        </div>

        <div className="bg-white flex justify-between px-4 pt-16">
          <div className="flex-grow pr-6">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-800">{mentor.name}</h1>
              <p className="text-gray-600">{`${mentor.jobTitle} @ ${mentor.company}`}</p>

              <div className="flex items-center mt-1 text-gray-500">
                <LocationOn fontSize="small" />
                <span className="ml-2">{mentor.location}</span>
              </div>

              <div className="flex items-center mt-1 text-gray-500">
                <Star fontSize="small" className="text-yellow-500" />
                <span className="ml-2">
                  {mentor.ratings} ({mentor.reviews_cnt} reviews)
                </span>
              </div>

              <div className="flex items-center mt-1 text-gray-500">
                <CheckCircle fontSize="small" className="text-green-500" />
                <span className="ml-2">Active this month</span>
              </div>

              <div className="flex items-center mt-1 text-gray-500">
                <AccessTime fontSize="small" />
                <Tooltip
                  title="Definition: Typically responds in half a day."
                  arrow
                  open={tooltipOpen}
                  onClose={handleTooltipClose}
                >
                  <span
                    className="ml-2 cursor-pointer text-blue-500 underline"
                    onClick={handleTooltipOpen}
                  >
                    Usually responds in half a day
                  </span>
                </Tooltip>
              </div>
            </div>

            {loggedMentorId !== id && (
              <Card className="mt-6 w-full" sx={{ maxWidth: 400 }}>
                <CardContent>
                  <Typography variant="h6" component="div" className="text-gray-800 font-semibold">
                    Session
                  </Typography>
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <IconButton color="primary">
                        <Phone />
                      </IconButton>
                      <NavLink to={`/mentors/${id}/slots`}>
                        <Button variant="outlined" color="primary">
                          Book a Call
                        </Button>
                      </NavLink>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconButton color="primary">
                        <Group />
                      </IconButton>
                      <Button variant="outlined" color="primary" onClick={joinCommunity}>
                        {communityJoined ? "Open Community" : "Join Community"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="ml-4 w-1/3">
            <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
            <div className="flex flex-wrap gap-1 mt-2">
              {skillsToShow.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" />
              ))}
            </div>

            <div className="mt-2">
              <a
                href="#"
                className="text-blue-500 cursor-pointer"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show Less' : 'Show More'}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center min-h-screen items-center py-3 px-2">
        <div className="bg-slate flex flex-col items-center justify-center drop-shadow-lg rounded-lg max-w w-full p-20">
          <div className="w-full">
            <h2 className=" text-lg lg:text-4xl font-bold text-start mb-4">
              About
            </h2>
            <p className="text-justify text-gray-700 text-xl">
              {mentor.bio}
            </p>
          </div>
        </div>
      </div>

      <Testimonial reviews={mentor.reviews} /> {/* Displaying mentor reviews */}
      <Outlet /> {/* Placeholder for nested routes */}
    </>
  );
};

export default Dashboard;
