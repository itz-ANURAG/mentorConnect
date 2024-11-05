/* eslint-disable no-unused-vars */
// CommunityPage.jsx
import React from 'react';
import PostCard from '../components/MentorPostCard';
import CommunityShortcut from '../components/CommunityShortcut';

const CommunityPage = () => {
  // Sample post data with images
  const posts = [
    { 
      title: "Mentor Post 1", 
      content: "This is the content of Mentor Post 1.", 
      image: "https://via.placeholder.com/300x200" 
    },
    { 
      title: "Mentor Post 2", 
      content: "This is the content of Mentor Post 2.", 
      image: "https://via.placeholder.com/300x200" 
    },
    { 
      title: "Mentor Post 3", 
      content: "This is the content of Mentor Post 3.", 
      image: "https://via.placeholder.com/300x200" 
    },
    // Add more posts as needed
  ];
  const communities = [
    "Community 1",
    "Community 2",
    "Community 3",
    "Community 4",
    "Community 5",
    // Add more as needed
  ];

  const handleCommunityClick = (communityName) => {
    alert(`You clicked on ${communityName}`);
  };

  return (
    <div className="flex p-6 font-sans">
      {/* Sidebar */}
      <div className="w-1/5 flex flex-col border-r border-gray-300 p-4">
        <h3 className="text-lg font-semibold mb-4">Joined Communities</h3>
            <div className="overflow-y-auto max-h-[70vh] flex flex-col space-y-2">
                {communities.map((community, index) => (
                <CommunityShortcut 
                    key={index} 
                    name={community} 
                    onClick={() => handleCommunityClick(community)} 
                />
                ))}
            </div>
        </div>


      {/* Content Area */}
      <div className="w-4/5 pl-6">
        <div className="border-b border-gray-300 pb-4 mb-6">
          <h2 className="text-2xl font-bold">Community Name</h2>
        </div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <PostCard 
              key={index} 
              title={post.title} 
              content={post.content} 
              image={post.image} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
