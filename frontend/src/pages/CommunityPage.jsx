// /* eslint-disable no-unused-vars */

// import React from 'react';
// import axios from 'axios';
// import CommunitySidebar from '../components/CommunitySideBar';
// import CommunityPostSection from '../components/CommunityPostSection';
// import Footer from '../components/footer'
// import Navbar from '../components/NavbarLandingPage';

// const CommunityPage = () => {
  

//   const posts = [
//     { 
//       title: "Mentor Post 1", 
//       content: "This is the content of Mentor Post 1.", 
//       imageUrl: "https://via.placeholder.com/300x200" 
//     },
//     { 
//       title: "Mentor Post 2", 
//       content: "This is the content of Mentor Post 2.", 
//       imageUrl: "https://via.placeholder.com/300x200" 
//     },
//     { 
//       title: "Mentor Post 3", 
//       content: "This is the content of Mentor Post 3.", 
//       imageUrl: "https://via.placeholder.com/300x200" 
//     },
//     // Add more posts as needed
//   ];
  
//   const communities = [
//     {
//       name: "Tech Enthusiasts",
//       image: "https://randomuser.me/api/portraits/men/10.jpg",
//       count: 125,
//     },
//     {
//       name: "Book Lovers",
//       image: "https://randomuser.me/api/portraits/women/12.jpg",
//       count: 300,
//     },
//     {
//       name: "Fitness Friends",
//       image: "https://randomuser.me/api/portraits/men/20.jpg",
//       count: 180,
//     },
//     {
//       name: "Photography Club",
//       image: "https://randomuser.me/api/portraits/women/25.jpg",
//       count: 75,
//     },
//     {
//       name: "Travel Buddies",
//       image: "https://randomuser.me/api/portraits/men/30.jpg",
//       count: 220,
//     },
//     {
//       name: "Foodies United",
//       image: "https://randomuser.me/api/portraits/women/40.jpg",
//       count: 90,
//     },
//   ];



//   return (
//     <>
//     <Navbar/>
//     <div className="flex p-6 font-sans">
//       {/* Sidebar */}
//       <CommunitySidebar select = {communities}/>

//       {/* Content Area */}
//       <CommunityPostSection select ={posts}/>
//     </div>
//     <Footer />
//     </>
//   );
// };

// export default CommunityPage;
// CommunityPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommunitySidebar from '../components/CommunitySideBar';
import CommunityPostSection from '../components/CommunityPostSection';
import Footer from '../components/Footer';
import Navbar from '../components/NavbarLandingPage';
import { useSelector } from 'react-redux';

const CommunityPage = () => {
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const token = useSelector((state) => (state.auth.token));

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/community/mentee/communities', {
          headers: { Authorization: `Bearer ${token}`}
        });
        console.log(response.data.communities);
        setCommunities(response.data.communities);
      } catch (error) {
        console.error("Error fetching communities", error);
      }
    };
    fetchCommunities();
  }, []);

  const fetchPosts = async (communityId) => {
    try {
      const response = await axios.get(`http://localhost:3000/community/${communityId}/posts`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const handleCommunitySelect = (community) => {
    setSelectedCommunity(community);
    fetchPosts(community.communityId);
  };

  return (
    <>
      <Navbar />
      <div className="flex p-6 font-sans">
        <CommunitySidebar communities={communities} onCommunitySelect={handleCommunitySelect} />
        <CommunityPostSection posts={posts} />
      </div>
      <Footer />
    </>
  );
};

export default CommunityPage;
