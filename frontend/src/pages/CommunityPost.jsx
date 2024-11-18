import React, { useEffect, useState } from 'react';
import CommunityPostPageHeader from '../components/CommunityPostPageHeader';
import CommunityPostSection from '../components/CommunityPostSection';
import { useSelector } from 'react-redux';
import CreatePostCommunity from '../components/CreatePostCommunity';
import axios from 'axios';
import NavbarLandingPage from '../components/NavbarLandingPage';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const CommunityPost = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // Get the mentor's data from Redux state
  const mentor = useSelector((state) => state.mentor.data);
  
  // Get the community name by combining the mentor's name and "Community"
  const communityName = (useSelector((state) => state.mentor.data.name)?.trim() || "") + "'s Community";
  
  // State to toggle visibility of the post creation popup
  const [showPopup, setShowPopup] = useState(false);

  // Get the community ID from the mentor's data
  const community_id = useSelector((state) => state.mentor.data.community);

  // Get the token for making authenticated requests from Redux state
  const token = useSelector((state) => state.auth.token);
  
  // State to store the posts and loading/error states
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch posts for the selected community
  const fetchPosts = async () => {
    try {
      setLoading(true); // Set loading to true before fetching posts
      const response = await axios.get(`${BACKEND_URL}/community/${community_id}/posts`);
      if (Array.isArray(response.data.posts)) {
        setPosts(response.data.posts.reverse()); // Reverse the posts array to display the most recent posts first
      } else {
        setPosts([]); // Set posts to an empty array if no posts are returned
      }
    } catch (error) {
      setError('Failed to fetch posts'); // Set error message if the API call fails
    } finally {
      setLoading(false); // Set loading to false after the API call completes
    }
  };

  // Effect hook to fetch posts when the community ID changes or when the component mounts
  useEffect(() => {
    if (community_id) fetchPosts();
  }, [community_id]);

  // Function to refresh the posts by clearing existing posts, resetting error, and re-fetching posts
  const onRefresh = () => {
    setPosts([]); // Clear existing posts
    setError(null); // Reset error message
    setLoading(true); // Set loading to true before fetching posts
    fetchPosts(); // Fetch the posts again
  };

  // Function to create a room for a video session
  const onRoom = async () => {
    console.log("Clicking on room");
    try {
      const response = await axios.post(`${BACKEND_URL}/community/roomCreate`, {
        email: mentor.email,
        userId: mentor._id,
      });
      // Show a success or error message based on the response
      if (response.data.success) toast.success("Check your email for session link");
      else toast.error(`${response.data.msg}`);
    } catch (error) {
      console.log("error", error); // Log the error to the console
      toast.error("Error while creating session"); // Display an error toast
    }
  };

  // Function to open the popup for creating a new post
  const onCreatePost = () => setShowPopup(true);

  // If the posts are still loading, display a loading message
  if (loading) return <p>Loading posts...</p>;

  // If there was an error fetching posts, display the error message
  if (error) return <p>{error}</p>;

  return (
    <>
      {/* Render the Navbar */}
      <NavbarLandingPage />
      
      {/* Render the header with the community name, refresh button, create post button, and session room creation */}
      <CommunityPostPageHeader
        select={{ communityName, onRefresh, onCreatePost, onRoom }}
      />
      
      {/* Render the section with the posts */}
      <CommunityPostSection posts={posts || []} />
      
      {/* Render the Footer */}
      <Footer />

      {/* Render the Create Post Pop-Up if the state is true */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative bg-white rounded-lg p-6 w-11/12 max-w-lg">
            <button
              onClick={() => setShowPopup(false)} // Close the popup when the close button is clicked
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              &times; {/* Close button */}
            </button>
            <CreatePostCommunity closePopup={() => setShowPopup(false)} /> {/* Render the post creation form */}
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityPost;
