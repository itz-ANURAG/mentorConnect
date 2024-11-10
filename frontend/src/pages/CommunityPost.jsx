/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import CommunityPostPageHeader from '../components/CommunityPostPageHeader';
import CommunityPostSection from '../components/CommunityPostSection';
import { useSelector } from 'react-redux';
import CreatePostCommunity from '../components/CreatePostCommunity';
import axios from 'axios';
import NavbarLandingPage from '../components/NavbarLandingPage';
import Footer from '../components/Footer';

const CommunityPost = () => {
    const communityName = (useSelector((state) => state.mentor.data.name)?.trim() || "") + "'s Community";
    const [showPopup, setShowPopup] = useState(false);
  const community_id = useSelector((state) => state.mentor.data.community);
  const token = useSelector((state) => state.auth.token);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true); 
      const response = await axios.get(`http://localhost:3000/community/${community_id}/posts`);
      if (Array.isArray(response.data.posts)) {
        setPosts(response.data.posts.reverse());
      } else {
        setPosts([]);
      }
    } catch (error) {
      setError('Failed to fetch posts'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (community_id) fetchPosts();
  }, [community_id]);

  const onRefresh = () => {
    setPosts([]);
    setError(null);
    setLoading(true);
    fetchPosts();
  };

  const onCreatePost = () => setShowPopup(true);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
     <NavbarLandingPage />
      <CommunityPostPageHeader
        select={{ communityName, onRefresh, onCreatePost }}
      />
      <CommunityPostSection select={posts || []} />
      <Footer />

      {/* Render the Create Post Pop-Up */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative bg-white rounded-lg p-6 w-11/12 max-w-lg">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <CreatePostCommunity closePopup={() => setShowPopup(false)} />
          </div>
        </div>

        
      )}
      
    </>
  );
};

export default CommunityPost;
