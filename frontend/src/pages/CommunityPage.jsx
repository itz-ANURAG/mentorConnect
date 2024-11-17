import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommunitySidebar from '../components/CommunitySideBar';
import CommunityPostSection from '../components/CommunityPostSection';
import Footer from '../components/Footer';
import Navbar from '../components/NavbarLandingPage';
import { useSelector } from 'react-redux';

const CommunityPage = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // State to hold the list of communities
  const [communities, setCommunities] = useState([]);
  
  // State to hold the posts for the selected community
  const [posts, setPosts] = useState([]);
  
  // State to keep track of the currently selected community
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  
  // State for storing any error messages related to fetching communities or posts
  const [error, setError] = useState(null);
  
  // Get the token from the Redux store for making authenticated requests
  const token = useSelector((state) => (state.auth.token));

  // Effect hook to fetch the list of communities when the component mounts or the token changes
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        // Make an API call to fetch communities for the mentee
        const response = await axios.get(`${BACKEND_URL}/community/mentee/communities`, {
          headers: { Authorization: `Bearer ${token}` } // Pass the token in the request header
        });
        setCommunities(response.data.communities); // Update state with the fetched communities
      } catch (error) {
        // Log error and set the error message to be displayed
        console.error("Error fetching communities", error);
        setError("Failed to load communities. Please try again later.");
      }
    };

    // Fetch communities when the token changes or on component mount
    fetchCommunities();
  }, [token]); // Re-run the effect if the token changes

  // Function to fetch posts for a specific community based on the selected community ID
  const fetchPosts = async (communityId) => {
    try {
      // Make an API call to fetch posts for the selected community
      const response = await axios.get(`${BACKEND_URL}/community/${communityId}/posts`);
      setPosts(response.data.posts); // Update state with the fetched posts
    } catch (error) {
      // Log error and set the error message to be displayed
      console.error("Error fetching posts", error);
      setError("Failed to load posts. Please try again later.");
    }
  };

  // Handler function to be called when a community is selected from the sidebar
  const handleCommunitySelect = (community) => {
    setSelectedCommunity(community); // Set the selected community
    fetchPosts(community.communityId); // Fetch the posts for the selected community
  };

  return (
    <>
      {/* Render the Navbar */}
      <Navbar />
      
      <div className="flex p-6 font-sans">
        {/* Sidebar to list the communities */}
        <CommunitySidebar communities={communities} onCommunitySelect={handleCommunitySelect} />

        {/* Display posts or error message depending on the current state */}
        {error ? (
          <div className="text-red-500 font-semibold">{error}</div> // Display error message
        ) : (
          <CommunityPostSection posts={posts} /> // Display posts if no error
        )}
      </div>
      
      {/* Render the Footer */}
      <Footer />
    </>
  );
};

export default CommunityPage;
