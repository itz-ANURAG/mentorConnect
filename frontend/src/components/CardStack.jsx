import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from 'axios'

const JobCard = ({ postId, username, content, imageUrl, timestamp, likes, dislikes, comments }) => {
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentDislikes, setCurrentDislikes] = useState(dislikes);
  const [showMore, setShowMore] = useState(false);

  const role = useSelector((state) => state.auth.role);
  const menteeData = useSelector((state) => state.mentee.data);
  const mentorData = useSelector((state) => state.mentor.data);
  let userId;
  if(role!=null){
  // Check if the user data exists
    userId = role === 'mentee' ? useSelector((state)=>state.mentee.data._id || state.mentee.data.id) : useSelector((state)=>state.mentor.data._id)
  }
  // Truncate content logic
  const truncatedContent =
    content.length > 150 && !showMore ? `${content.slice(0, 150)}...` : content;

  // Handle like click
  const handleLike = async () => {
    try {
      if (!role) {
        toast("Login first to like and dislike");
        return;
      }
      console.log("liking")
      const response = await axios.post(`http://localhost:3000/generalPost/likes`, {
        role,
        userId,
        postId,
      });
      if (response.data.success) {
        toast.success("Post Liked");
        setCurrentLikes(currentLikes + 1);
        console.log(response.data.already);
        if(response.data.already)setCurrentDislikes(currentDislikes-1);
      } else {
        toast.error(`${response.data.message}`);
        console.log(error)
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };
  
  // Handle dislike click
  const handleDislike = async () => {
    try {
      if (!role) {
        toast("Login first to like and dislike");
        return;
      }
      const response = await axios.post(`http://localhost:3000/generalPost/dislikes`, {
        role,
        userId,
        postId,
      });
      if (response.data.success) {
        toast.success(`${response.data.message}`);
        setCurrentDislikes(currentDislikes + 1);
        console.log(response.data.already)
        if(response.data.already)setCurrentLikes(currentLikes-1);
      } else {
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating dislikes:", error);
    }
  };

  return (
    <div
      className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 flex flex-col justify-between items-center m-4"
      style={{
        width: "40%", // Card width: 40% of the page
        height: "auto", // Allow card to grow with content, preventing overlap
        margin: "20px auto", // Add margin between cards for spacing
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* User Information (Top Section) */}
      <div className="w-full flex justify-start items-center mb-2">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center mr-2">
          {/* Dummy Image for Username */}
          <span className="text-white text-xl">U</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{username}</h4>
          <p className="text-gray-500 text-xs">{new Date(timestamp).toLocaleString()}</p>
        </div>
      </div>

      {/* Post Content (Above Image) */}
      <div className="text-center w-full mb-4 flex-grow">
        <p className="text-gray-700 text-sm">
          {truncatedContent}
          {content.length > 150 && (
            <button
              className="text-blue-600 hover:underline ml-2"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          )}
        </p>
      </div>

      {/* Post Image (Middle Section) */}
      {imageUrl && (
        <div className="w-full flex justify-center mb-4 relative">
          <img
            src={imageUrl}
            alt="Post"
            className="w-full h-full object-cover rounded-lg"
            style={{ maxHeight: "60%" }} // Adjust image size to take up remaining space
          />
        </div>
      )}

      {/* Likes, Dislikes, and Comments (Bottom Section) */}
      <div className="w-full flex justify-between items-center mt-4">
        <button className="text-sm text-gray-600" onClick={handleLike}>
          👍 {currentLikes}
        </button>
        <button className="text-sm text-gray-600" onClick={handleDislike}>
          👎 {currentDislikes}
        </button>
        <p className="text-gray-600 text-sm">💬 {comments} Comments</p>
      </div>
    </div>
  );
};

export default JobCard;
